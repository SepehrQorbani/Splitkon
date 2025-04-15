<?php

namespace App\Services;

use App\Lib\AttachmentManager;
use App\Models\Expense;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpenseService
{
    protected $request;
    protected $attachmentManager;
    protected $expense;

    public function __construct(Request $request, AttachmentManager $attachmentManager)
    {
        $this->request = $request;
        $this->attachmentManager = $attachmentManager;
    }

    public function createExpense(array $data)
    {
        return DB::transaction(function () use ($data) {
            $group = $this->request->attributes->get('group');
            $membersData = $data['members'] ?? null;
            $members = $this->loadMembers($membersData);
            $ratioData = $this->computeRatios($members, $membersData);

            if ($ratioData['split'] == 0) {
                throw new \InvalidArgumentException('Cannot create expense with zero split (no valid members or ratios).');
            }

            $amount = (float) $data['amount'];
            $this->expense = Expense::create(array_merge($data, [
                'group_id' => $group->id,
                'split' => $ratioData['split'],
                'amount' => $amount,
            ]));

            $shares = $this->calculateShares($ratioData['ratios'], $amount, $ratioData['split']);
            $localMembers = $this->expense->members->keyBy('id');
            $localMembers = $this->updateTotalExpenses($localMembers, $shares);
            $localMembers = $this->updateTotalPayments(
                $localMembers,
                $this->expense->spender_id,
                $this->expense->amount
            );

            if (isset($data['file'])) {
                $this->attachmentManager->storeAttachment($this->expense, $data['file'], $group);
            }
            $this->persistMemberChanges($localMembers);
            $this->expense->members()->attach($shares);

            return $this->expense;
        });
    }

    public function updateExpense(Expense $expense, array $data)
    {
        return DB::transaction(function () use ($expense, $data) {
            $this->expense = $expense;
            $group = $this->request->attributes->get('group');
            $needsRecalculation = isset($data['members']) || isset($data['amount']) || isset($data['spender_id']);

            if ($needsRecalculation) {
                $membersData = $data['members'] ?? null;
                $newMembers = $this->loadMembers($membersData, true);
                $ratioData = $this->computeRatios($newMembers, $membersData);

                if ($ratioData['split'] == 0) {
                    throw new \InvalidArgumentException('Cannot create expense with zero split (no valid members or ratios).');
                }

                $this->expense->split = $ratioData['split'];
                $this->expense->amount = isset($data['amount']) && $data['amount'] != $this->expense->amount
                    ? (float) $data['amount'] : $this->expense->amount;
                $this->expense->spender_id = $data['spender_id'] ?? $this->expense->spender_id;

                $newShares = $this->calculateShares($ratioData['ratios'], $this->expense->amount, $ratioData['split']);

                $localMembers = $this->expense->members->keyBy('id');
                $localMembers = $this->revertTotalExpenses($localMembers);

                $localMembers = $this->updateTotalExpenses($localMembers, $newShares);

                if ($this->expense->isDirty(['amount', 'spender_id'])) {
                    $localMembers = $this->revertTotalPayments($localMembers);
                    $localMembers = $this->updateTotalPayments(
                        $localMembers,
                        $this->expense->spender_id,
                        $this->expense->amount
                    );
                }

                $this->persistMemberChanges($localMembers);

                $this->expense->members()->sync($newShares);
            }

            if (isset($data['file'])) {
                $this->attachmentManager->replaceAttachment($this->expense, $data['file'], $group);
            }

            $this->expense->update($data);
            return $this->expense;
        });
    }


    public function destroyExpense(Expense $expense)
    {
        return DB::transaction(function () use ($expense) {
            $this->expense = $expense;
            $localMembers = $this->expense->members->keyBy('id');
            $localMembers = $this->revertTotalExpenses($localMembers);
            $localMembers = $this->revertTotalPayments($localMembers);
            $this->persistMemberChanges($localMembers);
            $expense->delete();
        });
    }

    protected function revertTotalExpenses($members)
    {
        foreach ($members as $member) {
            $share = $member->pivot->share;
            $member->total_expenses -= $share;
        }
        return $members;
    }

    protected function revertTotalPayments($members)
    {
        $originalAmount = $this->expense->getOriginal('amount');
        $originalSpenderId = $this->expense->getOriginal('spender_id');

        if (!isset($members[$originalSpenderId])) {
            $members[$originalSpenderId] = Member::find($originalSpenderId);
        }

        $members[$originalSpenderId]->total_payments -= $originalAmount;
        return $members;
    }

    protected function updateTotalExpenses($members, array $newShares)
    {
        foreach ($newShares as $memberId => $shareData) {
            if (!isset($members[$memberId])) {
                $members[$memberId] = Member::find($memberId);
            }
            $members[$memberId]->total_expenses += $shareData['share'];
        }
        return $members;
    }

    protected function updateTotalPayments($members, $spenderId, float $amount)
    {
        if (!isset($members[$spenderId])) {
            $members[$spenderId] = Member::find($spenderId);
        }
        $members[$spenderId]->total_payments += $amount;

        return $members;
    }

    protected function persistMemberChanges($localMembers)
    {
        foreach ($localMembers as $member) {
            $member->save();
        }
    }

    protected function loadMembers($membersData = null, $update = false)
    {
        if ($membersData) {
            return Member::whereIn('id', array_column($membersData, 'id'))->get();
        }
        $group = $this->request->attributes->get('group');
        return $update ? $this->expense->members : $group->members;
    }

    protected function computeRatios($members, $membersData = null)
    {
        $ratios = [];
        $split = 0;

        if ($membersData) {
            $membersRatio = array_column($membersData, 'ratio', 'id');
            foreach ($membersRatio as $id => $ratio) {
                $ratios[$id] = ['ratio' => $ratio];
                $split += $ratio;
            }
        } else {
            foreach ($members as $member) {
                $ratio = $member->pivot->ratio ?? $member->ratio;
                $ratios[$member->id] = ['ratio' => $ratio];
                $split += $ratio;
            }
        }

        return ['ratios' => $ratios, 'split' => $split];
    }

    protected function calculateShares(array $ratios, float $amount, float $split): array
    {
        $baseShare = $amount / $split;
        $calculatedShares = [];
        $sumOfShares = 0;

        foreach ($ratios as $memberId => $data) {
            $share = floor($baseShare * $data['ratio']);
            $calculatedShares[$memberId] = [
                'ratio' => $data['ratio'],
                'share' => $share,
                'remainder' => 0,
            ];
            $sumOfShares += $share;
        }

        $remainder = $amount - $sumOfShares;
        if ($remainder > 0) {
            $i = 0;
            foreach ($calculatedShares as $memberId => &$data) {
                if ($i < $remainder) {
                    $data['share'] += 1;
                    $data['remainder'] = 1;
                    $i++;
                } else {
                    break;
                }
            }
            unset($data);
        }

        return $calculatedShares;
    }
}
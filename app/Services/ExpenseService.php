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

            $this->expense->members()->attach($this->calculateShares($ratioData['ratios'], $amount, $ratioData['split']));
            $this->updateTotalExpenses();
            $this->updateTotalPayments();

            if (isset($data['file'])) {
                $this->attachmentManager->storeAttachment($this->expense, $data['file'], $group);
            }

            return $this->expense;
        });
    }

    public function updateExpense(Expense $expense, array $data)
    {
        return DB::transaction(function () use ($expense, $data) {
            $this->expense = $expense; // Set the expense property
            $group = $this->request->attributes->get('group');
            $needsRecalculation = isset($data['members']) || isset($data['amount']) || isset($data['spender_id']);

            if ($needsRecalculation) {
                $this->revertTotalExpenses();
                $this->revertTotalPayments();

                $membersData = $data['members'] ?? null;
                $members = $this->loadMembers($membersData, true);
                $ratioData = $this->computeRatios($members, $membersData);

                if ($ratioData['split'] == 0) {
                    throw new \InvalidArgumentException('Cannot create expense with zero split (no valid members or ratios).');
                }

                $this->expense->split = $ratioData['split'];
                $this->expense->amount = isset($data['amount']) ? (float) $data['amount'] : $this->expense->amount;
                $this->expense->spender_id = $data['spender_id'] ?? $this->expense->spender_id;
                $this->expense->members()->sync($this->calculateShares($ratioData['ratios'], $this->expense->amount, $ratioData['split']));
                $this->updateTotalExpenses();
                $this->updateTotalPayments();
            }

            if (isset($data['file'])) {
                $this->attachmentManager->replaceAttachment($this->expense, $data['file'], $group);
            }

            $this->expense->update($data);
            return $this->expense->fresh();
        });
    }

    public function destroyExpense(Expense $expense)
    {
        return DB::transaction(function () use ($expense) {
            $this->expense = $expense;
            $this->revertTotalExpenses();
            $this->revertTotalPayments();
            $this->expense->delete();
        });
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

    protected function updateTotalExpenses()
    {
        $members = $this->expense->fresh()->members;

        foreach ($members as $member) {
            $share = $member->pivot->share;
            $member->update([
                'total_expenses' => $member->total_expenses + $share,
            ]);
        }
    }

    protected function updateTotalPayments()
    {
        Member::where('id', $this->expense->spender_id)
            ->increment('total_payments', $this->expense->amount);
    }

    protected function revertTotalExpenses()
    {
        $members = $this->expense->members;
        foreach ($members as $member) {
            $share = $member->pivot->share;
            $member->update([
                'total_expenses' => $member->total_expenses - $share,
            ]);
        }
    }

    protected function revertTotalPayments()
    {
        Member::where('id', $this->expense->getOriginal('spender_id'))
            ->decrement('total_payments', $this->expense->getOriginal('amount'));
    }
}
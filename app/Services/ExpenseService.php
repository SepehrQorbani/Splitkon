<?php

namespace App\Services;

use App\Lib\AttachmentManager;
use App\Models\Expense;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

            $splitData = $this->computeSplitData($members, $membersData);

            $amount = $data['amount'];

            $this->expense = Expense::create(array_merge($data, [
                'group_id' => $group->id,
                'split' => $splitData['type'] === 'ratio' ? $splitData['total'] : null,
                'amount' => $amount,
            ]));

            $shares = $this->calculateSharesByType($splitData, $amount);

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

                $splitData = $this->computeSplitData($newMembers, $membersData);

                $this->expense->split = $splitData['type'] === 'ratio' ? $splitData['total'] : null;
                $this->expense->amount = isset($data['amount']) && $data['amount'] != $this->expense->amount
                    ? $data['amount'] : $this->expense->amount;
                $this->expense->spender_id = $data['spender_id'] ?? $this->expense->spender_id;

                $newShares = $this->calculateSharesByType($splitData, $this->expense->amount);

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

    // ========== Compute Split ==========
    protected function computeSplitData($members, $membersData = null)
    {
        if ($membersData) {
            $hasNullRatio = collect($membersData)->some(fn ($m) => ! isset($m['ratio']) || $m['ratio'] === null);

            if ($hasNullRatio) {
                return $this->computeShareSplitData($membersData);
            }
        }

        return $this->computeRatioSplitData($members, $membersData);
    }

    protected function computeRatioSplitData($members, $membersData = null)
    {
        $ratios = [];
        $split = 0;

        if ($membersData) {
            foreach ($membersData as $memberData) {
                $id = $memberData['id'];
                $ratio = $memberData['ratio'] ?? 1;
                $ratios[$id] = ['ratio' => $ratio];
                $split += $ratio;
            }
        } else {
            foreach ($members as $member) {
                $ratio = $member->pivot->ratio ?? $member->ratio ?? 1;
                $ratios[$member->id] = ['ratio' => $ratio];
                $split += $ratio;
            }
        }

        return [
            'type' => 'ratio',
            'data' => $ratios,
            'total' => $split,
        ];
    }

    protected function computeShareSplitData($membersData)
    {
        $shares = [];
        $total = 0;

        foreach ($membersData as $memberData) {
            $id = $memberData['id'];
            $share = $memberData['share'] ?? 0;
            $shares[$id] = ['share' => $share];
            $total += $share;
        }

        return [
            'type' => 'share',
            'data' => $shares,
            'total' => $total,
        ];
    }

    protected function calculateSharesByType(array $splitData, int $expenseAmount): array
    {
        return match ($splitData['type']) {
            'ratio' => $this->calculateRatioShares($splitData, $expenseAmount),
            'share' => $this->calculateShareShares($splitData, $expenseAmount),
            default => [],
        };
    }

    protected function calculateRatioShares(array $splitData, int $expenseAmount): array
    {
        $data = $splitData['data'];
        $total = $splitData['total'];

        $baseShare = $expenseAmount / $total;
        $shares = [];
        $sumOfShares = 0;

        foreach ($data as $memberId => $memberData) {
            $share = floor($baseShare * $memberData['ratio']);
            $shares[$memberId] = [
                'ratio' => $memberData['ratio'],
                'share' => $share,
                'remainder' => 0,
            ];
            $sumOfShares += $share;
        }

        $remainder = $expenseAmount - $sumOfShares;
        if ($remainder > 0) {
            $i = 0;
            foreach ($shares as $memberId => &$shareData) {
                if ($i < $remainder) {
                    $shareData['share'] += 1;
                    $shareData['remainder'] = 1;
                    $i++;
                } else {
                    break;
                }
            }
            unset($shareData);
        }

        return $shares;
    }

    protected function calculateShareShares(array $splitData, int $expenseAmount): array
    {
        $data = $splitData['data'];
        // $total = $splitData['total'];

        $shares = [];
        foreach ($data as $memberId => $memberData) {
            $shares[$memberId] = [
                'ratio' => null,
                'share' => $memberData['share'],
                'remainder' => 0,
            ];
        }

        return $shares;
    }

    // ========== Members Expense ==========

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

        if (! isset($members[$originalSpenderId])) {
            $members[$originalSpenderId] = Member::find($originalSpenderId);
        }

        $members[$originalSpenderId]->payment_balance -= $originalAmount;

        return $members;
    }

    protected function updateTotalExpenses($members, array $newShares)
    {
        foreach ($newShares as $memberId => $shareData) {
            if (! isset($members[$memberId])) {
                $members[$memberId] = Member::find($memberId);
            }
            $members[$memberId]->total_expenses += $shareData['share'];
        }

        return $members;
    }

    protected function updateTotalPayments($members, $spenderId, int $amount)
    {
        if (! isset($members[$spenderId])) {
            $members[$spenderId] = Member::find($spenderId);
        }
        $members[$spenderId]->payment_balance += $amount;

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
}

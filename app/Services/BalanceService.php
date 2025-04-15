<?php

namespace App\Services;

use App\Models\Member;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class BalanceService
{
    protected Collection $members;
    protected array $balance = [];
    protected bool $arrayFormat = false;

    public function __construct(Collection $members)
    {
        $this->members = $members;
    }

    public function calculate($includeRemainders = false, $arrayFormat = false): array
    {
        if ($this->members->isEmpty()) {
            return $this->balance;
        }
        $this->arrayFormat = $arrayFormat;

        $statuses = $this->members->mapWithKeys(function (Member $member) use ($includeRemainders) {
            $net = $member->payment_balance - $member->total_expenses;
            if ($includeRemainders && $member->remainder_history) {
                $remainderTotal = array_sum(array_column($member->remainder_history, 'amount'));
                $net -= $remainderTotal; // Subtract remainders as a liability
            }
            return [$member->id => $net];
        })->all();

        $this->resolveDebts($statuses);

        return $this->balance;
    }

    protected function resolveDebts(array &$statuses): void
    {
        while (true) {
            $maxAmount = max($statuses);
            $minAmount = min($statuses);

            if ($maxAmount == 0 && $minAmount == 0) {
                break;
            }

            $creditorId = array_search($maxAmount, $statuses);
            $debtorId = array_search($minAmount, $statuses);

            $settledAmount = min($maxAmount, abs($minAmount));

            $this->addTransaction($debtorId, $creditorId, $settledAmount);

            $statuses[$creditorId] -= $settledAmount;
            $statuses[$debtorId] += $settledAmount;
        }
    }

    protected function addTransaction(int $fromId, int $toId, int $amount): void
    {
        if ($this->arrayFormat) {
            $this->balance[] = ['from' => $fromId, 'to' => $toId, 'amount' => $amount];
        } else {
            $this->balance[$fromId][] = ['to' => $toId, 'amount' => $amount];
            $this->balance[$toId][] = ['to' => $fromId, 'amount' => -$amount];
        }
    }

    public function getBalance(): array
    {
        return $this->balance;
    }
}
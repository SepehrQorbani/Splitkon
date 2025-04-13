<?php
namespace App\Services;

use App\Models\Group;

class SummaryService
{
    public function getFinancialSummary(Group $group): array
    {
        $group->load([
            'expenses' => function ($query) {
                $query->orderByDesc('date')->take(3);
            },
            'repays' => function ($query) {
                $query->orderByDesc('date')->take(3);
            },
            'members'
        ]);
        $group->loadCount(['expenses', 'repays']);

        $totalExpenses = $group->expenses->sum('amount');
        $totalRepays = $group->repays->sum('amount');
        $pendingBalances = (new BalanceService($group->members))->calculate(false, true);
        $totalOutstanding = 0;
        $netBalances = $group->members->map(function ($member) use (&$totalOutstanding) {
            $net = $member->total_payments - $member->total_expenses;
            if ($net > 0) {
                $totalOutstanding += $net;
            }
            return [
                'id' => $member->id,
                'net' => $net,
            ];
        });
        $totalRatio = $group->members->sum('ratio');

        return [
            'members_count' => $group->members->count(),
            'expenses_count' => $group->expenses_count,
            'repays_count' => $group->repays_count,
            'total_ratio' => $totalRatio,
            'total_expenses' => $totalExpenses,
            'total_repays' => $totalRepays,
            'total_outstanding' => $totalOutstanding,
            'balance_status' => $netBalances->every(fn($balance) => $balance['net'] === 0) ? 'تراز شده' : 'تراز نشده',
            'net_balances' => $netBalances->toArray(),
            'pending_balances' => $pendingBalances,
            'recent_activity' => [
                'expenses' => $group->expenses,
                'repays' => $group->repays,
            ],
        ];
    }

    // Future method for Excel export
    public function toExcel(Group $group): string
    {
        $summary = $this->getFinancialSummary($group);
        // Logic to generate Excel file (e.g., using Maatwebsite\Excel)
// Return file path or binary content
        return "path/to/excel-file.xlsx";
    }
}
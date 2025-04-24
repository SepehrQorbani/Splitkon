<?php
namespace App\Services;

use App\Models\Group;
use App\Casts\Currency;

class SummaryService
{
    private Currency $currencyCast;

    public function __construct()
    {
        $this->currencyCast = new Currency();
    }

    public function getFinancialSummary(Group $group): array
    {
        $group->load([
            'expenses' => function ($query) {
                $query->with('spender')->orderByDesc('date')->take(3);
            },
            'repays' => function ($query) {
                $query->with(['from', 'to'])->orderByDesc('date')->take(3);
            },
            'members'
        ]);
        $group->loadCount(['expenses', 'repays'])
            ->loadSum(['expenses', 'repays'], 'amount');
        // $totalExpenses = $group->expenses()->sum('amount');
        // $totalRepays = $group->repays()->sum('amount');
        $pendingBalances = (new BalanceService($group->members))->calculate(false, true);
        $totalOutstanding = 0;
        $netBalances = $group->members->map(function ($member) use (&$totalOutstanding) {
            $net = $member->payment_balance - $member->total_expenses;
            if ($net > 0) {
                $totalOutstanding += $net;
            }
            return [
                'id' => $member->id,
                'net' => $net,
            ];
        });
        $totalRatio = $group->members->sum('ratio');

        // Combine and group recent activities by date
        $recentActivities = [];
        $group->expenses->each(function ($expense) use (&$recentActivities) {
            $date = $expense->date->format('Y-m-d');
            if (!isset($recentActivities[$date])) {
                $recentActivities[$date] = [
                    'date' => $date,
                    'expenses' => [],
                    'repays' => []
                ];
            }
            $recentActivities[$date]['expenses'][] = $expense;
        });

        $group->repays->each(function ($repay) use (&$recentActivities) {
            $date = $repay->date->format('Y-m-d');
            if (!isset($recentActivities[$date])) {
                $recentActivities[$date] = [
                    'date' => $date,
                    'expenses' => [],
                    'repays' => []
                ];
            }
            $recentActivities[$date]['repays'][] = $repay;
        });
        $recentActivities = collect($recentActivities)->sortByDesc('date')->values()->all();

        // Cast monetary values using Currency cast
        $totalExpenses = (int) $group->expenses_sum_amount ?? 0;
        $totalRepays = (int) $group->repays_sum_amount ?? 0;

        return [
            'members_count' => $group->members->count(),
            'expenses_count' => $group->expenses_count,
            'days_count' => ceil($group->date->diffInDays()),
            'repays_count' => $group->repays_count,
            'total_ratio' => $totalRatio,
            'total_expenses' => $this->currencyCast->get(null, null, $totalExpenses, []),
            'total_repays' => $this->currencyCast->get(null, null, $totalRepays, []),
            'total_outstanding' => $totalOutstanding,
            'net_balances' => $netBalances->toArray(),
            'pending_balances' => $pendingBalances,
            'recent_activity' => $recentActivities,
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
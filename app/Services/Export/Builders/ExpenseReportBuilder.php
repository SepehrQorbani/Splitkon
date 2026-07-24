<?php

namespace App\Services\Export\Builders;

use App\Models\Group;
use App\Services\Export\DTO\ReportDTO;

class ExpenseReportBuilder extends AbstractReportBuilder
{
    protected const BASE_KEYS = [
        'gregorianDate',
        'jalaliDate',
        'title',
        'by',
        'amount',
    ];

    public function __construct(protected Group $group) {}

    public function build(): ReportDTO
    {
        $group = $this->group;
        $group->loadMissing(['members', 'expenses.spender', 'expenses.members']);
        $baseLabels = $this->translateKeys(self::BASE_KEYS);
        $memberLabels = $group->members->pluck('name', 'id')->toArray();
        $headers = array_merge($baseLabels, $memberLabels);
        $expenseRows = [];
        $membersShare = array_fill_keys($memberLabels, 0);

        foreach ($group->expenses as $expense) {
            $mDate = $expense->date->format('Y-m-d');
            $lDate = $this->formatLocalizedDate($mDate);

            $row = [
                'gregorianDate' => $mDate,
                'jalaliDate' => $lDate,
                'title' => $expense->title,
                'by' => $expense->spender->name,
                'amount' => $expense->amount,
                ...$membersShare,
            ];

            foreach ($expense->members as $member) {
                $row[$member->name] = $member->pivot->share ?? 0;
            }

            $expenseRows[] = array_values($row);
        }

        return new ReportDTO(
            headers: $headers,
            rows: $expenseRows,
            title: __('ui.expenses'),
            meta: [
                'group_id' => $group->id,
                'generated_at' => now(),
            ]
        );
    }
}

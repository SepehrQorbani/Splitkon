<?php

namespace App\Services\Export\Builders;

use App\Models\Group;
use App\Services\Export\DTO\CompositeReportDTO;

class GroupReportBuilder extends AbstractReportBuilder
{
    public function __construct(protected Group $group) {}

    public function build(): CompositeReportDTO
    {
        $group = $this->group;
        $group->loadCount(['members', 'expenses'])
            ->loadSum('expenses', 'amount');

        $expenses = (new ExpenseReportBuilder($group))->build();
        $members = (new MembersReportBuilder($group))->build();
        $repays = (new RepayReportBuilder($group))->build();

        return new CompositeReportDTO(
            [$members, $expenses, $repays],
            $group->title,
            meta: [
                'member_count' => $group->members_count,
                'expense_count' => $group->expenses_count,
                'total_amount' => $group->expenses_sum_amount ?? 0,
                'created_at' => $group->created_at?->format('Y-m-d'),
            ],
        );
    }
}

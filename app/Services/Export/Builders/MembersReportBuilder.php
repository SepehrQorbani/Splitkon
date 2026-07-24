<?php

namespace App\Services\Export\Builders;

use App\Models\Group;
use App\Services\Export\DTO\ReportDTO;

class MembersReportBuilder extends AbstractReportBuilder
{
    private const KEYS = [
        'name',
        'ratio',
        'status',
        'expense_count',
        'total_expenses',
        'total_repays',
        'outstanding',
    ];

    public function __construct(protected Group $group) {}

    public function build(): ReportDTO
    {
        $group = $this->group;
        $group->loadMissing(['members' => fn ($q) => $q->withCount('expenses')]);

        $headers = $this->translateKeys(self::KEYS);

        $rows = $group->members->map(fn ($m) => $this->mapMember($m))
            ->toArray();

        return new ReportDTO(
            headers: $headers,
            rows: $rows,
            title: __('ui.members'),
            meta: [
                'group_id' => $group->id,
                'generated_at' => now(),
            ]
        );
    }

    private function mapMember($member): array
    {
        $debtCredit = ($member->payment_balance ?? 0) - ($member->total_expenses ?? 0);

        return [
            $member->name,
            $member->ratio,
            $this->memberStatusLabel($debtCredit),
            $member->expenses_count ?? $member->expenses()->count(),
            $member->total_expenses ?? 0,
            $member->payment_balance ?? 0,
            $debtCredit,
        ];
    }

    private function memberStatusLabel(float $balance): string
    {
        if ((int) $balance === 0) {
            return __('ui.settled');
        }

        return $balance > 0 ? __('ui.debtor') : __('ui.creditor');
    }
}

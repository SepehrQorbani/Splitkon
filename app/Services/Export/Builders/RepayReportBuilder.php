<?php

namespace App\Services\Export\Builders;

use App\Models\Group;
use App\Services\Export\DTO\ReportDTO;

class RepayReportBuilder extends AbstractReportBuilder
{
    protected const BASE_KEYS = [
        'gregorianDate',
        'jalaliDate',
        'from',
        'to',
        'amount',
        'description',
    ];

    public function __construct(protected Group $group) {}

    public function build(): ReportDTO
    {
        $group = $this->group;
        $group->loadMissing(['repays.to', 'repays.from']);
        $headers = $this->translateKeys(self::BASE_KEYS);
        $rows = [];

        foreach ($group->repays as $repay) {
            $mDate = $repay->date->format('Y-m-d');
            $lDate = $this->formatLocalizedDate($mDate);
            $rows[] = [
                $mDate,
                $lDate,
                $repay->from->name ?? '',
                $repay->to->name ?? '',
                $repay->amount,
                $repay->description,
            ];
        }

        return new ReportDTO(
            headers: $headers,
            rows: $rows,
            title: __('ui.repays'),
            meta: [
                'group_id' => $group->id,
                'generated_at' => now(),
            ]
        );
    }
}

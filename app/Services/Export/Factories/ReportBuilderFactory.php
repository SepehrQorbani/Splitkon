<?php

namespace App\Services\Export\Factories;

use App\Models\Group;
use App\Services\Export\Builders\ExpenseReportBuilder;
use App\Services\Export\Builders\GroupReportBuilder;
use App\Services\Export\Builders\MembersReportBuilder;
use App\Services\Export\Builders\RepayReportBuilder;
use InvalidArgumentException;

class ReportBuilderFactory
{
    private array $buildersMap = [
        'group' => GroupReportBuilder::class,
        'expenses' => ExpenseReportBuilder::class,
        'repays' => RepayReportBuilder::class,
        'members' => MembersReportBuilder::class,
    ];

    public function make(Group $group, string $key)
    {
        if (! isset($this->buildersMap[$key])) {
            throw new InvalidArgumentException("Unknown builder key: {$key}");
        }

        $class = $this->buildersMap[$key];

        return new $class($group);
    }
}

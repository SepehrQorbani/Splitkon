<?php

namespace App\Services\Export\DTO;

class CompositeReportDTO
{
    /**
     * @param  ReportDTO[]  $reports
     */
    public function __construct(
        public array $reports,
        public ?string $title = null,
        public array $meta = []
    ) {}
}

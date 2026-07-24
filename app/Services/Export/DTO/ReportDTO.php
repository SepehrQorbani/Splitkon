<?php

namespace App\Services\Export\DTO;

class ReportDTO
{
    public function __construct(
        public array $headers,
        public array $rows,
        public ?string $title = null,
        public array $meta = []
    ) {}
}

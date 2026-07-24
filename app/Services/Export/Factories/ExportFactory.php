<?php

namespace App\Services\Export\Factories;

use App\Services\Export\Adapters\CsvExportAdapter;
use App\Services\Export\Adapters\ExcelExportAdapter;
use App\Services\Export\Adapters\PdfExportAdapter;
use App\Services\Export\DTO\CompositeReportDTO;
use App\Services\Export\DTO\ReportDTO;
use App\Services\Export\Interfaces\ExportAdapterInterface;
use InvalidArgumentException;

class ExportFactory
{
    public function make(string $format, CompositeReportDTO|ReportDTO $report): ExportAdapterInterface
    {
        return match ($format) {
            'csv' => new CsvExportAdapter($report),
            'xlsx' => new ExcelExportAdapter($report),
            'pdf' => new PdfExportAdapter($report),
            default => throw new InvalidArgumentException("فرمت خروجی نامعتبر است: $format"),
        };
    }
}

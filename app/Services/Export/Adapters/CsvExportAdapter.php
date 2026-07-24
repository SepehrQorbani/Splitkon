<?php

namespace App\Services\Export\Adapters;

use App\Services\Export\DTO\CompositeReportDTO;
use App\Services\Export\DTO\ReportDTO;
use App\Services\Export\Interfaces\ExportAdapterInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class CsvExportAdapter implements ExportAdapterInterface
{
    public function __construct(protected ReportDTO|CompositeReportDTO $data) {}

    public function download(?string $filename = null): StreamedResponse
    {
        $filename = $filename ?? 'export_'.now()->format('Ymd_His').'.csv';

        try {
            return response()->streamDownload(function () {
                $handle = fopen('php://output', 'w');
                if ($handle === false) {
                    throw new Exception('Failed to open output stream');
                }

                // Add UTF-8 BOM for proper Persian/Arabic character support
                fprintf($handle, "\xEF\xBB\xBF");

                $delimiter = ','; // Configurable in future

                if ($this->data instanceof CompositeReportDTO) {
                    foreach ($this->data->reports as $index => $report) {
                        // Add section separator
                        fputcsv($handle, ['---- '.($report->title ?? 'Section').' ----'], $delimiter);

                        if (empty($report->rows)) {
                            fputcsv($handle, $report->headers, $delimiter);
                            fputcsv($handle, ['No data available'], $delimiter);
                        } else {
                            $this->writeReport($handle, $report, $delimiter);
                        }

                        // Add empty lines between sections
                        fputcsv($handle, [], $delimiter);
                        fputcsv($handle, [], $delimiter);
                    }
                } else {
                    if (empty($this->data->rows)) {
                        fputcsv($handle, $this->data->headers, $delimiter);
                        fputcsv($handle, ['No data available'], $delimiter);
                    } else {
                        $this->writeReport($handle, $this->data, $delimiter);
                    }
                }

                fclose($handle);
            }, $filename, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"$filename\"",
                'X-Export-Format' => 'csv',
                'X-Export-Generated-At' => now()->toIso8601String(),
            ]);

        } catch (Throwable $e) {
            Log::error('CSV export failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            throw new Exception('CSV export failed: '.$e->getMessage(), 500);
        }
    }

    private function writeReport($handle, ReportDTO $report, string $delimiter): void
    {
        // if ($report->title) {
        //     fputcsv($handle, [$report->title], $delimiter);
        //     fputcsv($handle, [], $delimiter); // خط فاصله
        // }

        // هدر
        fputcsv($handle, $report->headers, $delimiter);

        // ردیف‌ها
        foreach ($report->rows as $row) {
            fputcsv($handle, $row, $delimiter);
        }
    }
}

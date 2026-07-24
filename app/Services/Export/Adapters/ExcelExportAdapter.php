<?php

namespace App\Services\Export\Adapters;

use App\Services\Export\DTO\CompositeReportDTO;
use App\Services\Export\DTO\ReportDTO;
use App\Services\Export\Interfaces\ExportAdapterInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Table;
use PhpOffice\PhpSpreadsheet\Worksheet\Table\TableStyle;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ExcelExportAdapter implements ExportAdapterInterface
{
    public function __construct(
        protected ReportDTO|CompositeReportDTO $report
    ) {}

    public function download(?string $filename = null): StreamedResponse
    {
        $filename = $filename ?? 'export_'.now()->format('Ymd_His').'.xlsx';

        try {
            $spreadsheet = new Spreadsheet;

            if ($this->report instanceof CompositeReportDTO) {
                $sheetCreated = false;
                foreach ($this->report->reports as $index => $report) {
                    if (count($report->rows)) {
                        $sheet = $sheetCreated
                            ? $spreadsheet->createSheet()
                            : $spreadsheet->getActiveSheet();
                        $this->renderSheet($sheet, $report);
                        $sheetCreated = true;
                    }
                }

                // If no data, add empty sheet with message
                if (!$sheetCreated) {
                    $sheet = $spreadsheet->getActiveSheet();
                    $sheet->setCellValue('A1', 'No data available');
                }
            } else {
                $sheet = $spreadsheet->getActiveSheet();
                if (count($this->report->rows)) {
                    $this->renderSheet($sheet, $this->report);
                } else {
                    $sheet->setCellValue('A1', 'No data available');
                }
            }

            // Clear output buffers to prevent corruption
            while (ob_get_level()) {
                ob_end_clean();
            }

            $writer = new Xlsx($spreadsheet);

            return response()->streamDownload(function () use ($writer) {
                $writer->save('php://output');
            }, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => "attachment; filename=\"$filename\"",
                'Cache-Control' => 'max-age=0, must-revalidate',
                'Pragma' => 'public',
                'X-Export-Format' => 'xlsx',
                'X-Export-Generated-At' => now()->toIso8601String(),
            ]);

        } catch (Throwable $e) {
            Log::error('Excel export failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new Exception('Excel export failed: '.$e->getMessage(), 500);
        }
    }

    private function renderSheet($sheet, ReportDTO $report): void
    {
        $sheet->setRightToLeft(true);

        if ($report->title) {
            $sheet->setTitle(Str::substr($report->title, 0, 31)); // محدودیت اکسل
        }

        $rowIndex = 1;

        foreach ($report->headers as $colIndex => $header) {
            $cell = $this->columnName($colIndex + 1).$rowIndex;
            $sheet->setCellValue($cell, $header);
        }
        $rowIndex++;

        foreach ($report->rows as $row) {
            foreach ($row as $colIndex => $cellValue) {
                $cell = $this->columnName($colIndex + 1).$rowIndex;
                $sheet->setCellValue($cell, $cellValue);
            }
            $rowIndex++;
        }

        foreach (range(1, count($report->headers)) as $col) {
            $sheet->getColumnDimension($this->columnName($col))->setAutoSize(true);
        }

        $lastColumn = $sheet->getHighestColumn();
        $lastRow = $sheet->getHighestRow();
        $range = "A1:{$lastColumn}{$lastRow}";

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ]);

        $sheet->getStyle($range)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        $table = new Table($range);
        $table->setAllowFilter(true);
        $style = new TableStyle('TableStyleMedium15');
        $style->setShowRowStripes(true);
        $table->setStyle($style);
        $sheet->addTable($table);

        $sheet->freezePane('A2');
    }

    /** Number → Excel column (1 → A, 28 → AB) */
    private function columnName(int $index): string
    {
        $dividend = $index;
        $columnName = '';

        while ($dividend > 0) {
            $modulo = ($dividend - 1) % 26;
            $columnName = chr(65 + $modulo).$columnName;
            $dividend = (int) (($dividend - $modulo) / 26);
        }

        return $columnName;
    }
}

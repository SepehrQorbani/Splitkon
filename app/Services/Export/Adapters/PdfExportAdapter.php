<?php

namespace App\Services\Export\Adapters;

use App\Services\Export\DTO\CompositeReportDTO;
use App\Services\Export\DTO\ReportDTO;
use App\Services\Export\Interfaces\ExportAdapterInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;
use TCPDF_FONTS;

class PdfExportAdapter implements ExportAdapterInterface
{
    private const BRAND = '#4f39f6';
    private const SURFACE = '#ffffff';
    private const SURFACE_ALT = '#f9fafb';
    private const BORDER = '#e5e7eb';
    private const TEXT = '#111827';

    public function __construct(protected ReportDTO|CompositeReportDTO $report) {}

    public function download(?string $filename = null): StreamedResponse
    {
        $filename = $filename ?? 'export_'.now()->format('Ymd_His').'.pdf';

        try {
            $locale = app()->getLocale();

            $pdf = new \TCPDF(
                orientation: 'P',
                unit: 'mm',
                format: 'A4',
                unicode: true,
                encoding: 'UTF-8',
            );

            if ($locale === 'fa') {
                $pdf->setRTL(true);
            }

            $regularFont = $this->loadFont('AradFD-Regular.ttf', 'dejavusans');
            $boldFont = $this->loadFont('Arad-Bold.ttf', $regularFont);

            $pdf->SetCreator('SplitKon');
            $pdf->SetAuthor('SplitKon');
            $pdf->SetTitle($this->report->title ?? 'Report');
            $pdf->SetMargins(10, 10, 10);
            $pdf->SetAutoPageBreak(true, 15);
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            $pdf->setFontSubsetting(true);

            $pdf->SetFont($regularFont, '', 9);

            $reports = $this->report instanceof CompositeReportDTO
                ? $this->report->reports
                : [$this->report];

            $pdf->AddPage();
            $this->renderGlobalHeader($pdf, $regularFont, $boldFont, $locale);

            $firstReport = true;
            foreach ($reports as $report) {
                if (empty($report->rows)) {
                    continue;
                }

                if ($firstReport) {
                    $firstReport = false;
                } else {
                    $this->renderSectionSeparator($pdf, $regularFont);
                }

                $this->renderSectionHeader($pdf, $regularFont, $boldFont, $report->title ?? '', $locale);
                $this->renderTable($pdf, $regularFont, $report);
            }

            $this->renderPageFooter($pdf, $regularFont, $locale);

            while (ob_get_level()) {
                ob_end_clean();
            }

            $pdfContent = $pdf->Output($filename, 'S');

            return response()->streamDownload(function () use ($pdfContent) {
                echo $pdfContent;
            }, $filename, [
                'Content-Type' => 'application/pdf',
                'Content-Length' => strlen($pdfContent),
                'X-Export-Format' => 'pdf',
                'X-Export-Generated-At' => now()->toIso8601String(),
            ]);

        } catch (Throwable $e) {
            Log::error('PDF export failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'report_type' => get_class($this->report),
            ]);

            throw new Exception('PDF export failed: '.$e->getMessage(), 500);
        }
    }

    private function sanitizeText(string $text): string
    {
        return preg_replace('/[\x{10000}-\x{10FFFF}]/u', '', $text);
    }

    private function truncateText(\TCPDF $pdf, string $text, float $maxWidth): string
    {
        if ($pdf->GetStringWidth($text) <= $maxWidth) {
            return $text;
        }

        $ellipsis = '...';
        $low = 0;
        $high = mb_strlen($text);

        while ($low < $high) {
            $mid = (int) ceil(($low + $high) / 2);
            if ($pdf->GetStringWidth(mb_substr($text, 0, $mid).$ellipsis) <= $maxWidth) {
                $low = $mid;
            } else {
                $high = $mid - 1;
            }
        }

        return mb_substr($text, 0, $low).$ellipsis;
    }

    private function loadFont(string $filename, string $fallback): string
    {
        $path = resource_path('fonts/'.$filename);
        if (! file_exists($path)) {
            return $fallback;
        }

        $added = TCPDF_FONTS::addTTFfont($path, 'TrueTypeUnicode', '', 96);
        return $added !== false ? $added : $fallback;
    }

    private function renderGlobalHeader(\TCPDF $pdf, string $regular, string $bold, string $locale): void
    {
        $groupTitle = $this->report instanceof CompositeReportDTO
            ? ($this->report->title ?? '')
            : '';

        $meta = $this->report instanceof CompositeReportDTO
            ? $this->report->meta
            : [];

        $halfW = ($pdf->getPageWidth() - 20) / 2;

        $pdf->SetFont($bold, '', 16);
        $pdf->SetTextColor(79, 57, 246);

        if (empty($groupTitle)) {
            $pdf->Cell(0, 8, 'SplitKon', 0, 1, 'C');
            $titleTruncated = false;
        } else {
            $sanitized = $this->sanitizeText($groupTitle);
            $truncated = $this->truncateText($pdf, $sanitized, $halfW - 2);
            $titleTruncated = $truncated !== $sanitized;

            if ($locale === 'fa') {
                $pdf->Cell($halfW, 8, $truncated, 0, 0, 'R');
                $pdf->Cell($halfW, 8, 'SplitKon', 0, 1, 'L');
            } else {
                $pdf->Cell($halfW, 8, $truncated, 0, 0, 'L');
                $pdf->Cell($halfW, 8, 'SplitKon', 0, 1, 'R');
            }
        }

        $pdf->SetTextColor(0, 0, 0);

        if ($titleTruncated) {
            $pdf->SetFont($regular, '', 7);
            $pdf->SetTextColor(107, 114, 128);
            $pdf->MultiCell(0, 4, $this->sanitizeText($groupTitle), 0, $locale === 'fa' ? 'R' : 'L', false);
            $pdf->SetTextColor(0, 0, 0);
        }

        if (! empty($meta)) {
            $parts = [];
            if (isset($meta['member_count'])) {
                $parts[] = __('ui.member_count').': '.$meta['member_count'];
            }
            if (isset($meta['expense_count'])) {
                $parts[] = __('ui.expense_count').': '.$meta['expense_count'];
            }
            if (isset($meta['total_amount'])) {
                $parts[] = __('ui.total_expenses').': '.number_format($meta['total_amount']).' '.__('ui.currency');
            }

            if (! empty($parts)) {
                $pdf->SetFont($regular, '', 8);
                $pdf->SetTextColor(107, 114, 128);

                $statsText = $this->sanitizeText(implode('  |  ', $parts));

                if ($locale === 'fa') {
                    $pdf->Cell(0, 5, $statsText, 0, 1, 'R');
                } else {
                    $pdf->Cell(0, 5, $statsText, 0, 1, 'L');
                }

                $pdf->SetTextColor(0, 0, 0);
            }
        }

        $pdf->SetDrawColor(209, 213, 219);
        $pdf->SetLineWidth(0.1);
        $pdf->Line(10, $pdf->GetY() + 1, 200, $pdf->GetY() + 1);
        $pdf->SetLineWidth(0.2);
        $pdf->SetDrawColor(0, 0, 0);

        $pdf->Ln(5);
        $pdf->SetFont($regular, '', 9);
    }

    private function renderSectionHeader(\TCPDF $pdf, string $regular, string $bold, string $title, string $locale): void
    {
        $align = $locale === 'fa' ? 'R' : 'L';
        $pdf->SetFont($bold, '', 10);
        $pdf->SetTextColor(107, 114, 128);
        $pdf->Cell(0, 7, $this->sanitizeText($title), 0, 1, $align);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(1);
        $pdf->SetFont($regular, '', 9);
    }

    private function renderTable(\TCPDF $pdf, string $font, ReportDTO $report): void
    {
        $html = '<table border="0" cellpadding="4" cellspacing="0" style="width: 100%; font-size: 8px; border-collapse: collapse;">';

        $html .= '<tr>';
        foreach ($report->headers as $header) {
            $html .= '<th style="background-color: '.self::BRAND.'; color: #ffffff; font-weight: bold; text-align: center; padding: 5px; border: 1px solid '.self::BRAND.';">'.htmlspecialchars($this->sanitizeText($header), ENT_QUOTES, 'UTF-8').'</th>';
        }
        $html .= '</tr>';

        foreach ($report->rows as $index => $row) {
            $bg = $index % 2 === 0 ? self::SURFACE : self::SURFACE_ALT;
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= '<td style="background-color: '.$bg.'; text-align: center; padding: 4px; border: 1px solid '.self::BORDER.'; color: '.self::TEXT.';">'.htmlspecialchars($this->sanitizeText((string) ($cell ?? '')), ENT_QUOTES, 'UTF-8').'</td>';
            }
            $html .= '</tr>';
        }

        $html .= '</table>';

        $pdf->writeHTML($html, true, false, false, false, '');
    }

    private function renderSectionSeparator(\TCPDF $pdf, string $font): void
    {
        $pdf->Ln(4);
        $pdf->SetDrawColor(209, 213, 219);
        $pdf->SetLineWidth(0.05);
        $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
        $pdf->SetLineWidth(0.2);
        $pdf->SetDrawColor(0, 0, 0);
        $pdf->Ln(4);
    }

    private function renderPageFooter(\TCPDF $pdf, string $font, string $locale): void
    {
        $pdf->Ln(4);
        $pdf->SetFont($font, '', 7);
        $pdf->SetTextColor(107, 114, 128);

        $date = $this->sanitizeText($this->formatDate($locale));
        $align = $locale === 'fa' ? 'R' : 'L';
        $pdf->Cell(0, 4, 'SplitKon | '.$date, 0, 1, $align);

        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont($font, '', 9);
    }

    private function formatDate(string $locale): string
    {
        if ($locale === 'fa') {
            $formatter = new \IntlDateFormatter(
                'fa_IR@calendar=persian',
                \IntlDateFormatter::FULL,
                \IntlDateFormatter::FULL,
                'Asia/Tehran',
                \IntlDateFormatter::TRADITIONAL,
                'yyyy/MM/dd HH:mm'
            );
            return $formatter->format(now());
        }

        return now()->format('Y-m-d H:i');
    }
}

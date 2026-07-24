<?php

namespace App\Services\Export;

use App\Models\Group;
use App\Services\Export\Factories\ExportFactory;
use App\Services\Export\Factories\ReportBuilderFactory;
use Exception;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

class ExportService
{
    public function __construct(
        protected ExportFactory $factory,
        protected ReportBuilderFactory $reportBuilderFactory
    ) {}

    /**
     * Export data in specified format
     *
     * @param Group $group The group to export data for
     * @param string $reportKey The report type (group, expenses, members, repays)
     * @param string $format The export format (csv, xlsx, pdf)
     * @return mixed The download response
     *
     * @throws InvalidArgumentException If report key or format is not supported
     * @throws Exception If export generation fails
     */
    public function export(Group $group, string $reportKey, string $format): mixed
    {
        try {
            // Build the report
            $reportBuilder = $this->reportBuilderFactory->make($group, $reportKey);
            $report = $reportBuilder->build();

            // Create the appropriate adapter
            $adapter = $this->factory->make($format, $report);

            // Log export activity
            Log::info('Export generated', [
                'group_id' => $group->id,
                'report' => $reportKey,
                'format' => $format,
                'timestamp' => now()->toIso8601String(),
            ]);

            return $adapter->download();

        } catch (InvalidArgumentException $e) {
            Log::warning('Invalid export request', [
                'group_id' => $group->id,
                'report' => $reportKey,
                'format' => $format,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        } catch (Throwable $e) {
            Log::error('Export generation failed', [
                'group_id' => $group->id,
                'report' => $reportKey,
                'format' => $format,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new Exception('Failed to generate export: '.$e->getMessage(), 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportRequest;
use App\Services\Export\ExportService;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ExportController extends Controller
{
    /**
     * Handle export request
     */
    public function __invoke(ExportRequest $request, ExportService $service): StreamedResponse|JsonResponse
    {
        try {
            $format = $request->input('format', 'csv');
            $reportKey = $request->input('report', 'group');
            $group = $request->attributes->get('group');

            return $service->export($group, $reportKey, $format);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid export parameters',
                'message' => $e->getMessage(),
            ], 400);

        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => 'Export generation failed',
                'message' => 'An error occurred while generating the export. Please try again.',
            ], 500);
        }
    }
}

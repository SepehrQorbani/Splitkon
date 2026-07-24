<?php

namespace App\Services\Export\Builders;

use App\Services\Export\DTO\CompositeReportDTO;
use App\Services\Export\DTO\ReportDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use IntlDateFormatter;

abstract class AbstractReportBuilder
{
    protected function translate(string $key): string
    {
        $full = "ui.{$key}";
        if (Lang::has($full)) {
            return __($full);
        }

        return $key;
    }

    protected function translateKeys(array $keys): array
    {
        return array_map(fn ($k) => $this->translate($k), $keys);
    }

    protected function formatLocalizedDate(\DateTimeInterface|string $date, ?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();

        if ($locale === 'fa') {
            $formatter = new IntlDateFormatter(
                'fa_IR@calendar=persian',
                IntlDateFormatter::FULL,
                IntlDateFormatter::FULL,
                'Asia/Tehran',
                IntlDateFormatter::TRADITIONAL,
                'yyyy/MM/dd'
            );
        } else {
            $formatter = new IntlDateFormatter(
                'en_US',
                IntlDateFormatter::FULL,
                IntlDateFormatter::FULL,
                'Asia/Tehran',
                IntlDateFormatter::GREGORIAN,
                'yyyy-MM-dd'
            );
        }

        if (! $date instanceof \DateTimeInterface) {
            try {
                $date = Carbon::parse($date);
            } catch (\InvalidArgumentException $e) {
                return (string) $date;
            }
        }

        return $formatter->format($date);
    }

    abstract public function build(): CompositeReportDTO|ReportDTO;
}

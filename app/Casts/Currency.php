<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Currency implements CastsAttributes
{
    public function get(Model|null $model, string|null $key, mixed $value, array $attributes): mixed
    {
        if (is_null($value)) {
            return null;
        }

        $currency = request()->attributes->get('group')->currency ?? ['conversion_factor' => 10, 'decimal_precision' => 0];
        $conversionFactor = $currency['conversion_factor'];
        $decimalPrecision = $currency['decimal_precision'];

        $displayAmount = $value / $conversionFactor;

        return round($displayAmount, $decimalPrecision);
    }

    public function set(Model|null $model, string|null $key, mixed $value, array $attributes): mixed
    {
        if (is_null($value)) {
            return null;
        }

        $currency = request()->attributes->get('group')->currency;
        $conversionFactor = $currency['conversion_factor'] ?? 1;

        return (int) ($value * $conversionFactor);
    }
}

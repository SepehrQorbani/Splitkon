<?php
namespace App\Http\Resources;

use App\Casts\Currency;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyExpenseResource extends JsonResource
{
    public function toArray($request)
    {
        $currencyCast = new Currency();

        return [
            'date' => $this->expense_date,
            'total' => $currencyCast->get(null, 'total', $this->total_amount, [])
        ];
    }
}
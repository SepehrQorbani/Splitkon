<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DailyExpenseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'date' => $this->expense_date,
            'total' => (int) $this->total_amount,
        ];
    }
}
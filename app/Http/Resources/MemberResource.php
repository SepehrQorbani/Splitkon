<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group_id' => $this->group_id,
            'avatar' => $this->avatar,
            'name' => $this->name,
            'ratio' => $this->pivot->ratio ?? $this->ratio,
            'share' => $this->whenPivotLoaded('expense_member', function () {
                return (int) $this->pivot->share;
            }),
            'remainder' => $this->whenPivotLoaded('expense_member', function () {
                return (int) $this->pivot->remainder;
            }),
            'bank_info' => $this->bank_info,
            'total_expenses' => $this->total_expenses,
            'payment_balance' => $this->payment_balance,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

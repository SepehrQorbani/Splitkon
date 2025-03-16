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
            'ratio' => $this->ratio,
            'bank_info' => $this->bank_info,
            'total_expenses' => $this->total_expenses,
            'total_payments' => $this->total_payments,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

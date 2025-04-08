<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray($request)
    {
        //TODO: Edit this to return the correct data
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'date' => $this->date,
            'amount' => (int) $this->amount,
            'split' => $this->split,
            'spender' => $this->spender,
            'members' => MemberResource::collection($this->members),
            // 'members' => MemberResource::collection($this->members->map(function ($member) {
            //     $member->ratio = $member->pivot->ratio;
            //     $member->share = $member->pivot->share;
            //     return $member;
            // })),
            'attachments' => $this->attachments,
        ];
    }
}
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->date,
            'currency' => $this->currency,
            'description' => $this->description,
            'view_token' => $this->view_token,
            'edit_token' => $this->edit_token,
            'members' => MemberResource::collection($this->whenLoaded('members')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    // public function with(Request $request): array
    // {
    //     // if ($request->method() === 'POST' && !$request->route()->named('members.store')) {
    //     return [
    //         'links' => [
    //             'view' => url("/{$this->view_token}"),
    //             'edit' => $this->when($this->edit_token, url("/{$this->edit_token}"), null),
    //         ],
    //     ];
    //     // }
    //     // return [];
    // }
}

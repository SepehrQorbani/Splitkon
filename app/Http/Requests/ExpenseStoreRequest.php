<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ExpenseStoreRequest extends ExpenseRequest
{
    public function rules()
    {
        $membersId = $this->group->members->pluck('id')->all();

        return [
            'title' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'spender_id' => ['required', Rule::in($membersId)],
            'members' => 'sometimes|array',
            'members.*.id' => ['required_with:members', Rule::in($membersId)],
            'members.*.ratio' => 'nullable|numeric|min:1',
            'members.*.share' => 'nullable|numeric|min:0',
            'file' => 'nullable|file|mimes:jpeg,jpg,pdf,png,doc,docx,txt|max:10240',
        ];
    }
}

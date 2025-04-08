<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExpenseUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return $this->attributes->get('access') === 'edit';
    }

    public function rules()
    {
        $group = $this->attributes->get('group');
        $membersId = $group->members->pluck('id')->all();

        return [
            'title' => 'nullable|string',
            'amount' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'date' => ['nullable', 'regex:/(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})( \d{1,2}:\d{1,2})*/'],
            'spender_id' => ['nullable', Rule::in($membersId)],
            'members' => 'sometimes|array',
            'members.*.id' => ['required_with:members', Rule::in($membersId)],
            'members.*.ratio' => 'required_with:members|numeric|min:1',
            'file' => 'nullable|file|mimes:jpeg,jpg,pdf,png,doc,docx,txt|max:10240',
        ];
    }
}
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RepayUpdateRequest extends FormRequest
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
            'from_id' => ['nullable', Rule::in($membersId)],
            'to_id' => ['nullable', Rule::in($membersId), 'different:from_id'],
            'date' => 'nullable|date',
            'amount' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpeg,jpg,pdf,png,doc,docx,txt|max:10240',
        ];
    }
}
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RepayStoreRequest extends FormRequest
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
            'from_id' => ['required', Rule::in($membersId)],
            'to_id' => ['required', Rule::in($membersId), 'different:from_id'],
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpeg,jpg,pdf,png,doc,docx,txt|max:10240',
        ];
    }
}
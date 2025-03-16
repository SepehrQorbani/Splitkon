<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class MemberStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return request()->attributes->get('access') === 'edit';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|string|max:255',
            'ratio' => 'required|integer|min:1',
            'bank_info' => 'nullable|json',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => trans('Member name is required.'),
            'ratio.required' => trans('Member ratio is required.'),
            'ratio.integer' => trans('Member ratio must be an integer.'),
            'ratio.min' => trans('Member ratio must be at least 1.'),
        ];
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => trans('Edit access required'),
        ], 403));
    }
}

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
            'bank_info' => 'nullable|string',
        ];
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => __('messages.editAccessRequired'),
        ], 403));
    }
}

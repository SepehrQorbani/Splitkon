<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GroupUpdateRequest extends FormRequest
{

    public function authorize(): bool
    {
        return request()->attributes->get('access') === 'edit';
    }

    public function rules(): array
    {
        return [
            'title' => 'string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => __('messages.editAccessRequired'),
        ], 403));
    }
}

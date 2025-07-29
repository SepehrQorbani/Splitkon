<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Traits\ValidatesMemberRolesTrait;
use Illuminate\Validation\Validator;

class GroupStoreRequest extends FormRequest
{
    use ValidatesMemberRolesTrait;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'currency' => 'sometimes|array',
            'currency.code' => 'required_with:currency|string',
            'currency.display_unit' => 'required_with:currency|string',
            'currency.conversion_factor' => 'required_with:currency|numeric|min:1',
            'currency.decimal_precision' => 'required_with:currency|integer|min:0',
            'description' => 'nullable|string|max:1000',
            'members' => 'nullable|array',
        ], MemberStoreRequest::memberArrayRules());
    }

    public function withValidator(Validator $validator): void
    {
        $this->applyMemberRolesValidation($validator, []);
    }
}

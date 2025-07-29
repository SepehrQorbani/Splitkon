<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Validator;
use App\Http\Requests\Traits\ValidatesMemberRolesTrait;

class MemberStoreRequest extends FormRequest
{
    use ValidatesMemberRolesTrait;

    public function authorize(): bool
    {
        return request()->attributes->get('access') === 'edit';
    }

    public function rules(): array
    {
        return $this->isArrayInput() ? $this->arrayRules() : $this->singleRules();
    }

    protected function isArrayInput(): bool
    {
        $input = $this->all();
        return isset($input[0]) && is_array($input[0]);
    }

    protected function arrayRules(): array
    {
        return [
            '*.avatar' => 'nullable|string|max:255',
            '*.name' => 'required|string|max:255',
            '*.role' => 'nullable|in:0,1,2,3',
            '*.ratio' => 'required|integer|min:0',
            '*.bank_info' => 'nullable|string',
        ];
    }

    protected function singleRules(): array
    {
        return [
            'avatar' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'role' => 'nullable|in:0,1,2,3',
            'ratio' => 'required|integer|min:0',
            'bank_info' => 'nullable|string',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $group = $this->attributes->get('group');
        $existing = $group && $group->members ? $group->members->toArray() : [];

        $this->applyMemberRolesValidation($validator, $existing);
    }

    public static function memberArrayRules(string $prefix = 'members'): array
    {
        return collect((new static())->arrayRules())
            ->mapWithKeys(fn($rule, $key) => ["{$prefix}.{$key}" => $rule])
            ->all();
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => __('messages.editAccessRequired'),
        ], 403));
    }
}

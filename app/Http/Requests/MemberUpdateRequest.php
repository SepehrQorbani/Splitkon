<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Validator;
use App\Http\Requests\Traits\ValidatesMemberRolesTrait;


class MemberUpdateRequest extends FormRequest
{
    use ValidatesMemberRolesTrait;

    public function authorize(): bool
    {
        return request()->attributes->get('access') === 'edit';
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'sometimes|nullable|string|max:255',
            'role' => 'sometimes|required|in:0,1,2,3',
            'ratio' => 'sometimes|required|integer|min:0',
            'bank_info' => 'sometimes|nullable|string',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $group = $this->attributes->get('group');
        $memberId = $this->route('id');

        $existing = $group
            ? $group->members
                ->filter(fn($m) => (string) $m->id !== (string) $memberId)
                ->map(fn($m) => $m->toArray())->toArray()
            : [];

        $this->applyMemberRolesValidation($validator, $existing);
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'message' => __('messages.editAccessRequired'),
        ], 403));
    }
}

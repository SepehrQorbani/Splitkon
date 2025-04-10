<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $memberRequest = new MemberStoreRequest();
        $memberRules = $memberRequest->rules();
        $prefixedMemberRules = collect($memberRules)->mapWithKeys(function ($rule, $key) {
            return ["members.*." . (string) $key => $rule];
        })->all();

        return array_merge([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string|max:1000',
            'members' => 'nullable|array',
        ], $prefixedMemberRules);
    }
}

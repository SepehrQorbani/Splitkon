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
            'description' => 'nullable|string|max:1000',
            'members' => 'nullable|array',
        ], $prefixedMemberRules);
    }

    public function messages(): array
    {
        $memberRequest = new MemberStoreRequest();
        $memberMessages = $memberRequest->messages();

        $prefixedMemberMessages = collect($memberMessages)->mapWithKeys(function ($message, $key) {
            return ["members.*" . (string) $key => $message];
        })->all();

        return array_merge([
            'title.required' => trans('The group title is required.'),
        ], $prefixedMemberMessages);
    }
}

<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateMemberRoles implements ValidationRule
{

    public function __construct(protected array $members)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($this->members)) {
            $fail('The members array is invalid.');
            return;
        }

        $defaultCount = 0;
        $fundCount = 0;

        foreach ($this->members as $index => $member) {

            $role = (int) ($member['role'] ?? 0);
            $ratio = (int) ($member['ratio'] ?? 0);

            $isDefault = (bool) ($role & 1);
            $isFund = (bool) ($role & 2);

            if ($isFund && $ratio !== 0) {
                $fail(trans('validation.custom.members.ratio_zero_for_role', [
                    'attribute' => __('validation.attributes.ratio'),
                    'role' => __('validation.attributes.roles.2')
                ]));
            }
            if (!$isFund && $ratio < 1) {
                $fail(trans('validation.min.numeric', [
                    'attribute' => __('validation.attributes.ratio'),
                    'min' => 1,
                ]));
            }

            if ($isDefault) {
                $defaultCount++;
            }
            if ($isFund) {
                $fundCount++;
            }
        }

        if ($defaultCount > 1) {
            $fail(trans('validation.custom.members.only_one_default', [
                'role' => __('validation.attributes.roles.1')
            ]));
        }
        if ($fundCount > 1) {
            $fail(trans('validation.custom.members.only_one_fund', [
                'role' => __('validation.attributes.roles.2')
            ]));
        }
    }
}
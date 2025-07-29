<?php
namespace App\Http\Requests\Traits;

use App\Rules\ValidateMemberRoles;
use Illuminate\Validation\Validator;

trait ValidatesMemberRolesTrait
{
    protected function applyMemberRolesValidation(Validator $validator, array $existingMembers = []): void
    {
        $validator->after(function ($validator) use ($existingMembers) {
            $data = $validator->getData();

            if (isset($data['members']) && is_array($data['members'])) {
                $new = $data['members'];
            } elseif (isset($data[0]) && is_array($data[0])) {
                $new = $data;
            } elseif (isset($data['role'])) {
                $new = [$data];
            } else {
                $new = [];
            }

            $combined = array_merge($existingMembers, $new);
            if (empty($combined))
                return;

            $subValidator = \Illuminate\Support\Facades\Validator::make(
                ['members' => $combined],
                ['members' => ['required', 'array', new ValidateMemberRoles($combined)]]
            );

            if ($subValidator->fails()) {
                foreach ($subValidator->errors()->get('members') as $error) {
                    $validator->errors()->add('members', $error);
                }
            }
        });
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class ExpenseRequest extends FormRequest
{
    protected $group;

    public function __construct()
    {
        $this->group = request()->attributes->get('group');
    }

    public function authorize()
    {
        return request()->attributes->get('access') === 'edit' && ! $this->group->closing_date;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $members = request()->input('members', []);

            if (empty($members)) {
                return;
            }

            $firstMember = reset($members);
            $isShareMode = ! isset($firstMember['ratio']) || $firstMember['ratio'] === null;

            foreach ($members as $index => $member) {
                $currentIsShareMode = ! isset($member['ratio']) || $member['ratio'] === null;

                if ($currentIsShareMode !== $isShareMode) {
                    $validator->errors()->add('members', __('validation.custom.expense.mixed_split_mode'));

                    return;
                }

                if ($isShareMode) {
                    if (! isset($member['share'])) {
                        $validator->errors()->add("members.{$index}.share", __('validation.custom.expense.share_required'));
                    }
                } else {
                    if (! isset($member['ratio'])) {
                        $validator->errors()->add("members.{$index}.ratio", __('validation.custom.expense.ratio_required'));
                    }
                }
            }

            if ($isShareMode) {
                $totalShare = collect($members)->sum('share');
                $expenseAmount = request()->input('amount');

                if ($totalShare != $expenseAmount) {
                    $validator->errors()->add('members', __('validation.custom.expense.share_amount_mismatch', [
                        'total' => $totalShare,
                        'amount' => $expenseAmount,
                    ]));
                }
            }
        });
    }

    protected function failedAuthorization(): void
    {
        $message = $this->group->closing_date
            ? __('messages.groupClosed')
            : __('messages.editAccessRequired');

        throw new HttpResponseException(response()->json([
            'message' => $message,
        ], 403));
    }
}

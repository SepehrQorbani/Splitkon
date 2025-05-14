<?php

namespace App\Http\Requests;

use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Carbon\Carbon;

class GroupUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->attributes->get('access') === 'edit';
    }

    public function rules(): array
    {
        /** @var Group $group */
        $group = $this->attributes->get('group');

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'date' => [
                'sometimes',
                'date',
                function ($attribute, $value, $fail) use ($group) {
                    $date = Carbon::parse($value)->startOfDay();
                    $closingDate = $this->input('closing_date')
                        ? Carbon::parse($this->input('closing_date'))->startOfDay()
                        : ($group->closing_date ? Carbon::parse($group->closing_date)->startOfDay() : null);

                    if ($closingDate && $date->gt($closingDate)) {
                        $fail(trans('validation.custom.date.before_closing_date'));
                    }
                },
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'currency' => ['sometimes', 'array'],
            'currency.code' => ['required_with:currency', 'string'],
            'currency.display_unit' => ['required_with:currency', 'string'],
            'currency.conversion_factor' => ['required_with:currency', 'numeric', 'min:1'],
            'currency.decimal_precision' => ['required_with:currency', 'integer', 'min:0'],
            'closing_date' => [
                'sometimes',
                'nullable',
                'date',
                function ($attribute, $value, $fail) use ($group) {
                    $closingDate = Carbon::parse($value)->startOfDay();

                    if ($group->last_expense_date) {
                        $lastExpenseDate = Carbon::parse($group->last_expense_date)->startOfDay();
                        if ($closingDate->lt($lastExpenseDate)) {
                            $fail(trans('validation.custom.closing_date.after_last_expense'));
                        }
                    }

                    $date = $this->input('date')
                        ? Carbon::parse($this->input('date'))->startOfDay()
                        : ($group->date ? Carbon::parse($group->date)->startOfDay() : null);

                    if ($date && $closingDate->lt($date)) {
                        $fail(trans('validation.custom.closing_date.after_date'));
                    }
                },
            ],
        ];
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(response()->json([
            'message' => __('messages.editAccessRequired'),
        ], 403));
    }
}
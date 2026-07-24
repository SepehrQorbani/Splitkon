<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'format' => ['nullable', 'string', 'in:csv,xlsx,pdf'],
            'report' => ['nullable', 'string', 'in:group,expenses,members,repays'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'format.in' => 'The selected export format is not supported. Available formats: csv, xlsx, pdf',
            'report.in' => 'The selected report type is not available. Available reports: group, expenses, members, repays',
        ];
    }
}

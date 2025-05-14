<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ExpenseStoreRequest extends FormRequest
{
    protected $group;

    public function __construct()
    {
        $this->group = request()->attributes->get('group');
    }

    public function authorize()
    {
        return request()->attributes->get('access') === 'edit' && !$this->group->closing_date;
    }

    public function rules()
    {
        $membersId = $this->group->members->pluck('id')->all();

        return [
            'title' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'spender_id' => ['required', Rule::in($membersId)],
            'members' => 'sometimes|array',
            'members.*.id' => ['required_with:members', Rule::in($membersId)],
            'members.*.ratio' => 'required_with:members|numeric|min:1',
            'file' => 'nullable|file|mimes:jpeg,jpg,pdf,png,doc,docx,txt|max:10240',
        ];
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
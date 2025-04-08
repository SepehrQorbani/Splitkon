<?php
namespace App\Http\Controllers;

use App\Http\Requests\ExpenseStoreRequest;
use App\Http\Requests\ExpenseUpdateRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Services\ExpenseService;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = request()->attributes->get("group")
            ->expenses()->with(['spender', 'members', 'attachments'])->get();
        return ExpenseResource::collection($expenses);
    }

    public function store(ExpenseStoreRequest $request, ExpenseService $expenseService)
    {
        $expense = $expenseService->createExpense($request->validated());
        return new ExpenseResource($expense->load(['spender', 'members', 'attachments']));
    }

    public function show($token, $expenseId)
    {
        $group = request()->attributes->get('group');
        $expense = $group->expenses()->with(['spender', 'members', 'attachments'])->findOrFail($expenseId);
        return new ExpenseResource($expense);
    }

    public function update(ExpenseUpdateRequest $request, $token, Expense $expense, ExpenseService $expenseService)
    {
        $expense = $expenseService->updateExpense($expense, $request->validated());
        return new ExpenseResource($expense->load(['spender', 'members', 'attachments']));
    }

    public function destroy($token, Expense $expense, ExpenseService $expenseService)
    {
        $expenseService->destroyExpense($expense);
        return response()->noContent();
    }
}
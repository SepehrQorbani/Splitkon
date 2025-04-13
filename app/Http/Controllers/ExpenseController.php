<?php
namespace App\Http\Controllers;

use App\Http\Requests\ExpenseStoreRequest;
use App\Http\Requests\ExpenseUpdateRequest;
use App\Http\Resources\DailyExpenseResource;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

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

    public function dailyTotals($token)
    {
        $group = request()->attributes->get('group');
        $cacheKey = "group:{$group->id}:daily_expenses";

        // $dailyExpenses = Cache::remember($cacheKey, now()->addHours(1), function () use ($group) {
        // return $group->expenses()
        $dailyExpenses = $group->expenses()
            ->select(
                DB::raw('DATE(date) as expense_date'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->groupBy('expense_date')
            ->orderBy('expense_date', 'asc')
            ->get();
        // });

        return $dailyExpenses->isEmpty()
            ? response()->json(['data' => []], 200)
            : DailyExpenseResource::collection($dailyExpenses);
    }
}
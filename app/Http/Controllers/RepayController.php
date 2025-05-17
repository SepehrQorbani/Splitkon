<?php

namespace App\Http\Controllers;

use App\Http\Requests\RepayStoreRequest;
use App\Http\Requests\RepayUpdateRequest;
use App\Services\RepayService;
use App\Models\Repay;

class RepayController extends Controller
{
    public function index()
    {
        $repays = request()->attributes->get("group")
            ->repays()->with(['from', 'to', 'attachments'])->orderBy('date')->get();
        return response()->json(['data' => $repays]);
    }

    public function store(RepayStoreRequest $request, RepayService $repayService)
    {
        $repay = $repayService->createRepay($request->validated());
        return response()->json(['data' => $repay->load(['from', 'to', 'attachments'])]);
    }

    public function show($token, $repayId)
    {
        $group = request()->attributes->get('group');
        $repay = $group->repays()->with(['from', 'to', 'attachments'])->findOrFail($repayId);
        return response()->json(['data' => $repay]);
    }

    public function update(RepayUpdateRequest $request, $token, Repay $repay, RepayService $repayService)
    {
        $repay = $repayService->updateRepay($repay, $request->validated());
        return response()->json(['data' => $repay->load(['from', 'to', 'attachments'])]);
    }

    public function destroy(Repay $repay, RepayService $repayService)
    {
        $repayService->destroyRepay($repay);
        return response()->noContent();
    }
}

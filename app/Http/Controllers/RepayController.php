<?php

namespace App\Http\Controllers;

use App\Http\Requests\RepayStoreRequest;
use App\Http\Requests\RepayUpdateRequest;
use App\Http\Resources\RepayResource;
use App\Models\Repay;
use App\Services\RepayService;

class RepayController extends Controller
{
    public function index()
    {
        $repays = request()->attributes->get('group')
            ->repays()->with(['from', 'to', 'attachments'])->orderBy('date')->get();

        return RepayResource::collection($repays);
    }

    public function store(RepayStoreRequest $request, RepayService $repayService)
    {
        $repay = $repayService->createRepay($request->validated());

        return new RepayResource($repay->load(['from', 'to', 'attachments']));
    }

    public function show($token, $repayId)
    {
        $group = request()->attributes->get('group');
        $repay = $group->repays()->with(['from', 'to', 'attachments'])->findOrFail($repayId);

        return new RepayResource($repay);
    }

    public function update(RepayUpdateRequest $request, $token, Repay $repay, RepayService $repayService)
    {
        $repay = $repayService->updateRepay($repay, $request->validated());

        return new RepayResource($repay->load(['from', 'to', 'attachments']));
    }

    public function destroy(Repay $repay, RepayService $repayService)
    {
        $repayService->destroyRepay($repay);

        return response()->noContent();
    }
}

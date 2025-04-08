<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberStoreRequest;
use App\Http\Requests\MemberUpdateRequest;
use App\Http\Resources\MemberResource;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $group = $request->attributes->get('group');
        $members = $group->members()->get();
        return MemberResource::collection($members);
    }
    public function store(MemberStoreRequest $request)
    {
        $group = $request->attributes->get('group');
        $validatedData = $request->validated();

        if (isset($validatedData[0]) && is_array($validatedData[0])) {
            // Multiple members
            $members = $group->members()->createMany($validatedData);
            return MemberResource::collection($members);
        } else {
            // Single member
            $member = $group->members()->create($validatedData);
            return new MemberResource($member);
        }
    }

    public function show(Request $request, $token, $id)
    {
        $group = $request->attributes->get('group');
        $member = $group->members()->find($id);
        return new MemberResource($member);
    }

    public function update(MemberUpdateRequest $request, $token, $id)
    {
        $group = $request->attributes->get('group');
        $member = $group->members()->findOrFail($id);
        $member->update($request->validated());
        return new MemberResource($member);
    }

    public function destroy(Request $request, $token, $id)
    {
        //TODO: Implement validation for member deletion
        $group = $request->attributes->get('group');
        $member = $group->members()->findOrFail($id);
        $member->delete();
        return response()->json([
            'message' => 'Member deleted successfully'
        ], 200);
    }
}

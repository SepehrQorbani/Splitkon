<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupStoreRequest;
use App\Http\Requests\GroupUpdateRequest;
use App\Http\Requests\MemberStoreRequest;
use App\Http\Resources\GroupResource;
use App\Http\Resources\MemberResource;
use App\Models\Group;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    public function store(GroupStoreRequest $request)
    {
        try {
            DB::beginTransaction();

            $groupData = $request->only(['title', 'description']);
            $groupData['view_token'] = Str::random(32);
            $groupData['edit_token'] = Str::random(32);
            $group = Group::create($groupData);

            $membersData = $request->validated()['members'] ?? [];
            $members = collect($membersData)->map(function ($memberData) use ($group) {
                return $group->members()->create($memberData);
            });

            DB::commit();

            // Load members and return via GroupResource
            $group->load('members');
            return (new GroupResource($group))->response()->setStatusCode(201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => __('messages.failedToCreateGroup'),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show()
    {
        $group = request()->attributes->get('group');
        $group->load('members');
        return new GroupResource($group);
    }

    public function update(GroupUpdateRequest $request)
    {
        $group = $request->attributes->get('group');
        $group->update($request->validated());
        return new GroupResource($group);
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Closure;
use Illuminate\Http\Request;

class CheckGroupAccess
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->route('token');

        if (!$token) {
            return response()->json(['message' => trans('Page not found')], 404);
        }

        $group = Group::where('view_token', $token)
            ->orWhere('edit_token', $token)
            ->first();

        if (!$group) {
            return response()->json(['message' => trans('Group not found')], 404);
        }

        $access = $group->view_token === $token ? 'view' : 'edit';

        if ($access === 'view') {
            $group->edit_token = null;
        }

        $request->attributes->add(['group' => $group, 'access' => $access]);

        return $next($request);
    }

}

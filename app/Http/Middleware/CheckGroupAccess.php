<?php

namespace App\Http\Middleware;

use App\Models\Group;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
class CheckGroupAccess
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->route('token');

        if (!$token) {
            return response()->json(['message' => __('messages.pageNotFound')], 404);
        }

        $group = Cache::remember("group:token:$token", 3600, function () use ($token) {
            return Group::with('members')
                ->where('view_token', $token)
                ->orWhere('edit_token', $token)
                ->firstOrFail();
        });

        $access = $group->view_token === $token ? 'view' : 'edit';

        if ($access === 'view') {
            $group->edit_token = null;
        }

        $request->attributes->add(['group' => $group, 'access' => $access]);

        return $next($request);
    }

}

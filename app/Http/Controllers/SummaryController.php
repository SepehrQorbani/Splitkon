<?php

namespace App\Http\Controllers;

use App\Services\SummaryService;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    public function show($token)
    {
        $group = request()->attributes->get('group');
        // $group->load(['expenses', 'repays']);

        $summary = (new SummaryService())->getFinancialSummary($group);

        // return response('', 404)->json([]);
        // return response()->json(['message' => 'Not Found!'], 404);
        return response()->json([
            'group' => $group->only(['id', 'title']),
            'members' => $group->members,
            'summary' => $summary,
        ]);
    }
}

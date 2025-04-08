<?php

namespace App\Http\Controllers;

use App\Services\BalanceService;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function index($token)
    {
        $group = request()->attributes->get('group');
        $balance = (new BalanceService($group->members))->calculate();

        return response()->json($balance);
    }
}

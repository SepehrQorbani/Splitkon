<?php

namespace App\Models;

use App\Casts\Currency;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ExpenseMember extends Pivot
{

    protected $casts = [
        'share' => Currency::class,
        'remainder' => Currency::class,
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }
}
<?php

namespace App\Models;

use App\Casts\Currency;
use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\RecordsActivity;

class Member extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'group_id',
        'avatar',
        'name',
        'role',
        'ratio',
        'bank_info',
        'total_expenses',
        'payment_balance',
    ];

    protected $casts = [
        'bank_info' => 'array',
        'total_expenses' => Currency::class,
        'payment_balance' => Currency::class,
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function expenses()
    {
        return $this->belongsToMany(Expense::class)
            ->using(ExpenseMember::class)
            ->withPivot('ratio', 'share', 'remainder')
            ->withTimestamps();
    }
}

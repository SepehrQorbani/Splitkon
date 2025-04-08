<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'avatar', 'name', 'ratio', 'bank_info', 'total_expenses', 'total_payments'];

    protected $casts = [
        'bank_info' => 'array',
        'total_payments' => 'integer',
        'total_expenses' => 'integer',
        'remainder_history' => 'array',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function expenses()
    {
        return $this->belongsToMany(Expense::class)
            ->withPivot('ratio', 'share', 'remainder');
    }
}

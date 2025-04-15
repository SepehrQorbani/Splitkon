<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\RecordsActivity;

class Member extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['group_id', 'avatar', 'name', 'ratio', 'bank_info', 'total_expenses', 'payment_balance'];

    protected $casts = [
        'bank_info' => 'array',
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = ['group_id', 'avatar', 'name', 'ratio', 'bank_info', 'total_expenses', 'total_payments'];

    protected $casts = [
        'bank_info' => 'array',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}

<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Concerns\RecordsActivity;

class Group extends Model
{
    use LogsActivity;

    protected $fillable = ['title', 'description', 'date', 'currency', 'view_token', 'edit_token'];

    protected $attributes = [
        'currency' => '{"code":"IRR","display_unit":"toman","conversion_factor":10,"decimal_precision":0}',
    ];

    protected $casts = [
        'date' => 'date',
        'currency' => 'array',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($group) {
            $group->view_token = Str::random(32);
            $group->edit_token = Str::random(32);
        });
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
    public function repays()
    {
        return $this->hasMany(Repay::class);
    }
}

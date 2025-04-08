<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model
{
    protected $fillable = ['title', 'description', 'view_token', 'edit_token'];

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

<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use App\Models\Concerns\RecordsActivity;
use Carbon\Carbon;

class Group extends Model
{
    use LogsActivity;

    protected $fillable = [
        'title',
        'description',
        'date',
        'closing_date',
        'currency',
        'view_token',
        'edit_token'
    ];

    protected $attributes = [
        'currency' => '{"code":"IRR","display_unit":"toman","conversion_factor":10,"decimal_precision":0}',
    ];

    protected $casts = [
        'date' => 'date',
        'closing_date' => 'date',
        'currency' => 'array',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $group): void {
            $group->view_token = Str::random(32);
            $group->edit_token = Str::random(32);
        });
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function repays(): HasMany
    {
        return $this->hasMany(Repay::class);
    }

    public function getLastExpenseDateAttribute(): ?Carbon
    {
        return $this->expenses()->select('date')->orderByDesc('date')->first()?->date;
    }
}

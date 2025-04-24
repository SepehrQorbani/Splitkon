<?php

namespace App\Models;

use App\Casts\Currency;
use App\Models\Concerns\LogsActivity;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\RecordsActivity;

class Expense extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title',
        'amount',
        'split',
        'description',
        'date',
        'group_id',
        'spender_id',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => Currency::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function setDateAttribute($value)
    {
        $this->attributes['date'] = Carbon::parse($value)->toDateTimeString();
    }

    public function members()
    {
        return $this->belongsToMany(Member::class)
            ->using(ExpenseMember::class)
            ->withPivot(['ratio', 'share', 'remainder'])
            ->withTimestamps();
    }

    public function spender()
    {
        return $this->belongsTo(Member::class, 'spender_id');
    }

    public function attachments()
    {
        return $this->morphToMany(Attachment::class, 'attachmentable');
    }
}

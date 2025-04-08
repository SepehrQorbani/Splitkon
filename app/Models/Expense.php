<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;
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
        'date' => 'datetime',
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

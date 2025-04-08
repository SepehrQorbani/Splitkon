<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repay extends Model
{
    protected $fillable = [
        'from_id',
        'to_id',
        'amount',
        'description',
        'date',
        'group_id',
    ];

    public function from()
    {
        return $this->belongsTo(Member::class, 'from_id');
    }

    public function to()
    {
        return $this->belongsTo(Member::class, 'to_id');
    }

    public function attachments()
    {
        return $this->morphToMany(Attachment::class, 'attachmentable');
    }
}

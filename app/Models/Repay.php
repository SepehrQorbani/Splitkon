<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\RecordsActivity;

class Repay extends Model
{
    use LogsActivity;

    protected $fillable = [
        'from_id',
        'to_id',
        'amount',
        'description',
        'date',
        'group_id',
    ];

    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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

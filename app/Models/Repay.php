<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\RecordsActivity;

class Repay extends Model
{
    use RecordsActivity;

    protected static array $recordableEvents = ['created', 'updated', 'deleted'];

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

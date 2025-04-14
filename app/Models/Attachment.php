<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\Models\Concerns\RecordsActivity;

class Attachment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['title', 'description', 'path', 'group_id'];

    protected $appends = ['url'];

    protected static function booted(): void
    {
        parent::booted();

        static::deleting(function ($attachment) {
            $attachment->expenses()->detach();
        });
    }

    public function expenses()
    {
        return $this->morphedByMany(Expense::class, 'attachmentable');
    }

    public function repays()
    {
        return $this->morphedByMany(Repay::class, 'attachmentable');
    }

    public function url(): Attribute
    {
        return Attribute::make(
            get: function () {
                return asset(Storage::url($this->path));
            }
        );
    }
}

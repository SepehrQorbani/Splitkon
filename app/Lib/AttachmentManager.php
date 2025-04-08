<?php

namespace App\Lib;

use Illuminate\Support\Facades\Storage;

class AttachmentManager
{
    protected $storage;

    public function __construct(Storage $storage)
    {
        $this->storage = $storage;
    }

    public function storeAttachment($model, $file, $group)
    {
        $directory = "attachments/{$group->created_at->year}/{$group->id}";
        $path = $file->store($directory, 'public');

        return $model->attachments()->create([
            'title' => $model->id,
            'description' => $model->description,
            'path' => $path,
            'group_id' => $group->id,
        ]);
    }

    public function replaceAttachment($model, $file, $group)
    {
        $oldAttachment = $model->attachments()->first();
        if ($oldAttachment) {
            $this->storage->disk('public')->delete($oldAttachment->path);
            $oldAttachment->delete();
        }

        if ($file) {
            return $this->storeAttachment($model, $file, $group);
        }
    }
}
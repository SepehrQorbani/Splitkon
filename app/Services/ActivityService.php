<?php
namespace App\Services;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Model;

class ActivityService
{
    public function log(Model $model, string $action, string $transactionId)
    {
        Activity::create([
            'group_id' => $model->group_id,
            'action' => $action,
            'subject_type' => get_class($model),
            'subject_id' => $model->id,
            'description' => $this->getDescription($model, $action),
            'transaction_id' => $transactionId,
            'changes' => $this->getChanges($model, $action),
        ]);
    }

    protected function getDescription(Model $model, string $action): string
    {
        return "{$action}_" . strtolower(class_basename($model));
    }

    protected function getChanges(Model $model, string $action): ?array
    {
        if ($action === 'create') {
            return ['after' => $model->getAttributes()];
        }
        if ($action === 'update') {
            return [
                'before' => array_intersect_key($model->getOriginal(), $model->getDirty()),
                'after' => $model->getDirty(),
            ];
        }
        if ($action === 'delete') {
            return ['before' => $model->getAttributes()];
        }
        return null;
    }
}
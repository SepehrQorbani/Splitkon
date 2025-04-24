<?php
namespace App\Services;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class ActivityService
{
    public function log(Model $model, string $action, string $transactionId)
    {
        Activity::create([
            'group_id' => class_basename($model) === 'Group' ? $model->id : $model->group_id,
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
            return ['after' => Arr::except($model->getAttributes(), 'updated_at')];
        }
        if ($action === 'update') {
            return [
                'before' => Arr::except(array_intersect_key($model->getRawOriginal(), $model->getDirty()), 'updated_at'),
                'after' => Arr::except($model->getDirty(), 'updated_at'),
            ];
        }
        if ($action === 'delete') {
            return ['before' => Arr::except($model->getAttributes(), 'updated_at')];
        }
        return null;
    }
}
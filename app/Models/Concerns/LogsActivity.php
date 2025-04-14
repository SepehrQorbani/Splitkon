<?php
namespace App\Models\Concerns;

use App\Services\ActivityService;
use App\Support\TransactionIdManager;
use Illuminate\Database\Eloquent\Model;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function (Model $model) {
            if (static::shouldLogAction($model, 'created')) {
                $transactionId = TransactionIdManager::getTransactionId();
                app(ActivityService::class)->log($model, 'create', $transactionId);
            }
        });

        static::updated(function (Model $model) {
            if (static::shouldLogAction($model, 'updated')) {
                $logAttributes = static::getModelProperty($model, 'logAttributes', null);
                if (is_null($logAttributes) || $model->wasChanged($logAttributes)) {
                    $transactionId = TransactionIdManager::getTransactionId();
                    app(ActivityService::class)->log($model, 'update', $transactionId);
                }
            }
        });

        static::deleted(function (Model $model) {
            if (static::shouldLogAction($model, 'deleted')) {
                $transactionId = TransactionIdManager::getTransactionId();
                app(ActivityService::class)->log($model, 'delete', $transactionId);
            }
        });
    }

    protected static function shouldLogAction(Model $model, string $action): bool
    {
        $logActions = static::getModelProperty($model, 'logActions', ['created', 'updated', 'deleted']);
        return in_array($action, $logActions, true);
    }

    protected static function getModelProperty(Model $model, string $property, $default)
    {
        return property_exists($model, $property) ? $model->$property : $default;
    }
}
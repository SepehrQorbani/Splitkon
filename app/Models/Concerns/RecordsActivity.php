<?php

namespace App\Models\Concerns;

use App\Models\Activity;
use App\Models\Group;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;

trait RecordsActivity
{
    protected array $oldAttributes = [];
    protected string $activityEventName = '';

    public static function bootRecordsActivity(): void
    {
        foreach (static::recordableEvents() as $event) {
            static::$event(function ($model) use ($event) {
                $model->activityEventName = $event;
                $model->recordActivity($model->activityDescription($event));
            });

            if ($event === 'updated') {
                static::updating(function ($model) {
                    $model->oldAttributes = $model->getOriginal();
                });
            }
        }
    }

    protected function activityDescription(string $description): string
    {
        return "{$description}_" . strtolower(class_basename($this));
    }

    protected static function recordableEvents(): array
    {
        return static::$recordableEvents ?? ['created', 'updated', 'deleted'];
    }

    public function recordActivity(string $description): void
    {
        $this->activity()->create([
            'description' => $description,
            'changes' => $this->activityChanges(),
            'group_id' => $this instanceof Group ? $this->id : $this->group_id
        ]);
    }

    public function activity(): MorphMany|HasMany
    {
        if ($this instanceof Group) {
            return $this->hasMany(Activity::class)->latest();
        }

        return $this->morphMany(Activity::class, 'subject')->latest();
    }

    protected function activityChanges(): ?array
    {
        if ($this->wasChanged()) {
            return $this->getChangesArray();
        }

        if ($this->activityEventName === 'created') {
            return [
                'before' => [],
                'after' => Arr::except($this->getAttributes(), ['updated_at'])
            ];
        }

        if ($this->activityEventName === 'deleted') {
            return [
                'before' => Arr::except($this->getAttributes(), ['updated_at']),
                'after' => [],
            ];
        }

        return null;
    }

    protected function getChangesArray(): array
    {
        $after = Arr::except($this->getChanges(), ['updated_at']);
        $changes = [
            'before' => Arr::only($this->oldAttributes, array_keys($after)),
            'after' => $after,
        ];

        if ($this->shouldTrackMemberChanges()) {
            $this->addMemberChangesToArray($changes);
        }

        return $changes;
    }

    protected function shouldTrackMemberChanges(): bool
    {
        return class_basename($this) === 'Expense' &&
            ($this->isDirty('split') || $this->hasMembersChanged());
    }

    protected function hasMembersChanged(): bool
    {
        return json_encode($this->members) !== json_encode($this->members()->get());
    }

    protected function addMemberChangesToArray(array &$changes): void
    {
        $changes['before']['members'] = $this->formatMembersForChanges($this->members);
        $changes['after']['members'] = $this->formatMembersForChanges($this->members()->get());
    }

    protected function formatMembersForChanges($members): array
    {
        return $members->map(function ($member) {
            return [
                'id' => $member->id,
                'ratio' => $member->pivot->ratio,
            ];
        })->toArray();
    }
}
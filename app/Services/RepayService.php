<?php
namespace App\Services;

use App\Models\Repay;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Lib\AttachmentManager;

class RepayService
{
    protected $request;
    protected $attachmentManager;
    protected $repay;

    public function __construct(Request $request, AttachmentManager $attachmentManager)
    {
        $this->request = $request;
        $this->attachmentManager = $attachmentManager;
    }

    public function createRepay(array $data)
    {
        return DB::transaction(function () use ($data) {
            $group = $this->request->attributes->get('group');
            $this->repay = Repay::create(array_merge($data, [
                'group_id' => $group->id,
            ]));

            $localMembers = $this->loadMembers([$data['from_id'], $data['to_id']]);
            $localMembers = $this->updateTotalPayments(
                $localMembers,
                $this->repay->from_id,
                $this->repay->to_id,
                $this->repay->amount
            );

            if (isset($data['file'])) {
                $this->attachmentManager->storeAttachment($this->repay, $data['file'], $group);
            }

            $this->persistMemberChanges($localMembers);
            return $this->repay;
        });
    }

    public function updateRepay(Repay $repay, array $data)
    {
        return DB::transaction(function () use ($repay, $data) {
            $this->repay = $repay;
            $group = $this->request->attributes->get('group');

            $localMembers = $this->loadMembers([
                $this->repay->from_id,
                $this->repay->to_id,
                $data['from_id'] ?? null,
                $data['to_id'] ?? null
            ]);
            $this->repay->fill($data);

            if ($this->repay->isDirty(['amount', 'from_id', 'to_id'])) {
                $localMembers = $this->revertTotalPayments(
                    $localMembers,
                    $this->repay->getOriginal('from_id'),
                    $this->repay->getOriginal('to_id'),
                    $this->repay->getOriginal('amount')
                );

                $localMembers = $this->updateTotalPayments(
                    $localMembers,
                    $data['from_id'] ?? $this->repay->from_id,
                    $data['to_id'] ?? $this->repay->to_id,
                    $data['amount'] ?? $this->repay->amount
                );
            }

            if (isset($data['file'])) {
                $this->attachmentManager->replaceAttachment($this->repay, $data['file'], $group);
            }

            $this->persistMemberChanges($localMembers);
            $this->repay->update($data);
            return $this->repay;
        });
    }

    public function destroyRepay(Repay $repay)
    {
        return DB::transaction(function () use ($repay) {
            $this->repay = $repay;
            $localMembers = $this->loadMembers([$repay->from_id, $repay->to_id]);
            $localMembers = $this->revertTotalPayments(
                $localMembers,
                $repay->from_id,
                $repay->to_id,
                $repay->amount
            );
            $this->persistMemberChanges($localMembers);
            $repay->delete();
        });
    }

    protected function loadMembers(array $memberIds)
    {
        return Member::whereIn('id', array_filter($memberIds))->get()->keyBy('id');
    }

    protected function updateTotalPayments($members, $fromId, $toId, $amount)
    {
        if ($amount <= 0) {
            return $members;
        }

        if (!isset($members[$fromId])) {
            $members[$fromId] = Member::find($fromId);
        }
        if (!isset($members[$toId])) {
            $members[$toId] = Member::find($toId);
        }

        $members[$fromId]->total_payments += $amount;
        $members[$toId]->total_payments -= $amount;

        return $members;
    }

    protected function revertTotalPayments($members, $fromId, $toId, $amount)
    {
        if ($amount <= 0) {
            return $members;
        }

        if (!isset($members[$fromId])) {
            $members[$fromId] = Member::find($fromId);
        }
        if (!isset($members[$toId])) {
            $members[$toId] = Member::find($toId);
        }

        $members[$fromId]->total_payments -= $amount;
        $members[$toId]->total_payments += $amount;

        return $members;
    }

    protected function persistMemberChanges($localMembers)
    {
        foreach ($localMembers as $member) {
            $member->save();
        }
    }
}
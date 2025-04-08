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

            $this->updateTotalPayments($this->repay->amount);

            if (isset($data['file'])) {
                $this->attachmentManager->storeAttachment($this->repay, $data['file'], $group);
            }

            return $this->repay;
        });
    }

    public function updateRepay(Repay $repay, array $data)
    {
        return DB::transaction(function () use ($repay, $data) {
            $this->repay = $repay;
            $group = $this->request->attributes->get('group');

            $this->revertTotalPayments($repay->getOriginal('amount'));
            $this->updateTotalPayments($data['amount'] ?? $repay->amount);

            if (isset($data['file'])) {
                $this->attachmentManager->replaceAttachment($this->repay, $data['file'], $group);
            }

            $this->repay->update($data);
            return $this->repay->fresh();
        });
    }

    public function destroyRepay(Repay $repay)
    {
        return DB::transaction(function () use ($repay) {
            $this->repay = $repay;
            $this->revertTotalPayments($repay->amount);
            $this->repay->delete();
        });
    }

    protected function updateTotalPayments($amount)
    {
        if ($amount <= 0) {
            return;
        }

        Member::where('id', $this->repay->from_id)->increment('total_payments', $amount);
        Member::where('id', $this->repay->to_id)->decrement('total_payments', $amount);
    }

    protected function revertTotalPayments($originalAmount)
    {
        if ($originalAmount <= 0) {
            return;
        }

        Member::where('id', $this->repay->from_id)->decrement('total_payments', $originalAmount);
        Member::where('id', $this->repay->to_id)->increment('total_payments', $originalAmount);
    }
}
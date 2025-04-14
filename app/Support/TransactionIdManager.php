<?php
namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionIdManager
{
    private static $transactionId = null;
    private static $eventCount = 0;

    public static function getTransactionId(): string
    {
        self::$eventCount++;

        if (self::$eventCount === 1) {
            self::$transactionId = Str::uuid()->toString();
            DB::afterCommit(function () {
                self::$transactionId = null;
                self::$eventCount = 0;
            });
        }

        return self::$transactionId;
    }
}
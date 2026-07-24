<?php

namespace App\Services\Export\Interfaces;

interface ExportAdapterInterface
{
    public function download(?string $filename = null);
}

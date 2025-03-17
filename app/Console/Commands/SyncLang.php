<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncLang extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lang:sync {locale? : The locale to sync (e.g., en, fa), defaults to all} {--direction=server-to-client : Sync direction (server-to-client or client-to-server)} {--all : Sync all keys}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Laravel translation files to client-side JSON files, with potential for two-way sync in the future';

    /**
     * Path to the client-side language directory (relative to project root).
     *
     * @var string
     */
    protected $clientLangPath = 'client/src/lang/';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $direction = $this->option('direction') ?? 'server-to-client';
        $locale = $this->argument('locale');
        $all = $this->option('all') || false;

        $langPath = lang_path();

        if ($direction === 'server-to-client') {
            $this->syncServerToClient($locale, $langPath, $all);
        } elseif ($direction === 'client-to-server') {
            $this->syncClientToServer($locale, $langPath);
        } else {
            $this->error("Invalid direction: {$direction}. Use 'server-to-client' or 'client-to-server'.");
        }
    }


    protected function syncServerToClient($locale, $langPath, $all)
    {
        // Ensure the client lang directory exists
        if (!File::exists($this->clientLangPath)) {
            File::makeDirectory($this->clientLangPath, 0755, true);
            $this->info("Created directory: {$this->clientLangPath}");
        }

        // Determine locales to sync (specific or all)
        $locales = $locale ? [$locale] : array_map('basename', glob($langPath . '/*', GLOB_ONLYDIR));

        // Collect all existing client keys if --existing-only is set
        $clientKeys = [];
        if (!$all) {
            $clientFiles = glob($this->clientLangPath . '*.json');
            foreach ($clientFiles as $file) {
                $data = json_decode(File::get($file), true);
                if (is_array($data)) {
                    foreach ($data as $category => $translations) {
                        if (is_array($translations)) {
                            foreach (array_keys($translations) as $key) {
                                $clientKeys[$category][$key] = true;
                            }
                        }
                    }
                }
            }
        }

        foreach ($locales as $loc) {
            $langDir = $langPath . "/{$loc}";
            $clientFile = $this->clientLangPath . "{$loc}.json";

            // Load existing client JSON data
            $existingData = File::exists($clientFile) ? json_decode(File::get($clientFile), true) : [];
            if (!is_array($existingData)) {
                $this->warn("Invalid JSON in {$clientFile}, resetting to empty array");
                $existingData = [];
            }

            // Start with existing data to preserve non-synced keys
            $mergedData = $existingData;

            // Get all translation files for the locale
            $translationFiles = glob($langDir . '/*.php');
            foreach ($translationFiles as $file) {
                $fileName = pathinfo($file, PATHINFO_FILENAME); // e.g., "validation", "messages"
                $translations = require $file;

                if (!is_array($translations)) {
                    $this->warn("Skipping {$file}: not a valid translation array");
                    continue;
                }

                if ($fileName === 'validation') {
                    // Handle validation: split attributes and rules
                    $attributes = $translations['attributes'] ?? [];
                    unset($translations['attributes']);
                    $rules = $translations;

                    if (!$all) {
                        // Filter attributes and rules to existing client keys
                        $filteredAttributes = array_intersect_key($attributes, $clientKeys['attributes'] ?? []);
                        $filteredRules = array_intersect_key($rules, $clientKeys['validation'] ?? []);
                        $mergedData['attributes'] = $filteredAttributes;
                        $mergedData['validation'] = $filteredRules;
                    } else {
                        // Sync all attributes and rules
                        $mergedData['attributes'] = $attributes;
                        $mergedData['validation'] = $rules;
                    }
                } else {
                    // Other files (e.g., messages, passwords)
                    if (!$all) {
                        $filteredTranslations = array_intersect_key($translations, $clientKeys[$fileName] ?? []);
                        $mergedData[$fileName] = $filteredTranslations;
                    } else {
                        $mergedData[$fileName] = $translations;
                    }
                }
            }

            // Write the updated JSON file
            File::put($clientFile, json_encode($mergedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $this->info("Synced translations for {$loc} to {$clientFile}");
        }
    }

    protected function syncClientToServer($locale, $langPath)
    {
        // Placeholder for future client-to-server sync
        $this->info("Client-to-server sync not implemented yet.");
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ExportCmsSnapshot extends Command
{
    protected $signature = 'cms:export-snapshot';

    protected $description = 'Export public CMS content for a fresh production installation';

    public function handle(): int
    {
        $tables = [
            'tour_categories',
            'tours',
            'tour_highlights',
            'tour_inclusions',
            'tour_itinerary_items',
            'tour_images',
            'site_settings',
            'home_content_items',
            'hero_slides',
            'testimonials',
            'faqs',
        ];

        $snapshot = collect($tables)->mapWithKeys(fn (string $table): array => [
            $table => DB::table($table)->orderBy('id')->get()->map(fn (object $row): array => (array) $row)->all(),
        ])->all();

        $directory = database_path('seeders/data');
        File::ensureDirectoryExists($directory);
        File::put(
            $directory.'/cms-content.json',
            json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE).PHP_EOL,
        );

        $this->info('CMS snapshot exported without users, bookings, messages, sessions or credentials.');

        return self::SUCCESS;
    }
}

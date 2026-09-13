<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductionContentSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/cms-content.json');

        if (! is_file($path)) {
            throw new RuntimeException('CMS snapshot is missing. Run php artisan cms:export-snapshot locally first.');
        }

        $snapshot = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($snapshot): void {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            try {
                foreach ($snapshot as $table => $rows) {
                    if ($rows !== []) {
                        DB::table($table)->insertOrIgnore($rows);
                    }
                }
            } finally {
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            }
        });
    }
}

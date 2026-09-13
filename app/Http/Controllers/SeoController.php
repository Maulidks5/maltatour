<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        return response()
            ->view('sitemap', [
                'pages' => [
                    ['url' => route('home'), 'priority' => '1.0', 'frequency' => 'daily'],
                    ['url' => route('tours.index'), 'priority' => '0.9', 'frequency' => 'weekly'],
                    ['url' => route('safaris.index'), 'priority' => '0.9', 'frequency' => 'weekly'],
                    ['url' => route('about'), 'priority' => '0.7', 'frequency' => 'monthly'],
                    ['url' => route('contact'), 'priority' => '0.7', 'frequency' => 'monthly'],
                    ['url' => route('faq'), 'priority' => '0.7', 'frequency' => 'monthly'],
                    ['url' => route('feedback.create'), 'priority' => '0.4', 'frequency' => 'monthly'],
                ],
                'tours' => Tour::query()
                    ->published()
                    ->orderByDesc('updated_at')
                    ->get(['slug', 'updated_at']),
            ])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            '',
            'Sitemap: '.route('sitemap'),
            '',
        ]);

        return response($content)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}

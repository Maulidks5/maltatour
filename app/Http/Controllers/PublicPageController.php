<?php

namespace App\Http\Controllers;

use App\Models\HomeContentItem;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function about(): Response
    {
        $settings = SiteSetting::publicValues();

        return Inertia::render('About', [
            'content' => [
                'eyebrow' => $settings['about_eyebrow'] ?? 'Your local Zanzibar team',
                'title' => $settings['about_title'] ?? 'Meaningful journeys, planned with local care',
                'description' => $settings['about_description'] ?? 'Malta Tours and Safari helps travellers discover Zanzibar and Tanzania through well-planned, personal experiences.',
                'storyTitle' => $settings['about_story_title'] ?? 'More than a tour, a local connection',
                'story' => $settings['about_story'] ?? 'From island escapes and cultural visits to ocean adventures and mainland safaris, our goal is to make every part of your journey clear, comfortable and memorable. We listen to how you want to travel, then help shape the right experience around your time, group and interests.',
                'image' => $settings['about_image_path'] ?? ($settings['cta_image_path'] ?? '/images/malta-tour-placeholder.jpg'),
            ],
            'values' => HomeContentItem::query()
                ->where('section', 'why')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['title', 'description', 'icon']),
        ]);
    }

    public function contact(): Response
    {
        $settings = SiteSetting::publicValues();

        return Inertia::render('Contact', [
            'content' => [
                'eyebrow' => $settings['contact_page_eyebrow'] ?? 'Talk to our local team',
                'title' => $settings['contact_page_title'] ?? "Let's plan your Zanzibar experience",
                'description' => $settings['contact_page_description'] ?? 'Tell us your travel dates, group size and the experiences you are interested in. We will help you with the next steps.',
            ],
        ]);
    }
}

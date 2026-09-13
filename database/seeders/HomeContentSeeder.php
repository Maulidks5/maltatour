<?php

namespace Database\Seeders;

use App\Models\HomeContentItem;
use Illuminate\Database\Seeder;

class HomeContentSeeder extends Seeder
{
    public function run(): void
    {
        if (HomeContentItem::query()->exists()) {
            return;
        }

        $items = [
            ['trust', 'Local Zanzibar Guides', null, null, 'users'],
            ['trust', 'Hotel Pickup Available', null, null, 'car'],
            ['trust', 'Flexible Booking', null, null, 'calendar'],
            ['trust', 'Fast WhatsApp Support', null, null, 'message'],
            ['why', 'Experienced Local Guides', 'Certified guides who grew up on these islands.', null, 'award'],
            ['why', 'Reliable Hotel Transfers', 'On-time pickup from any hotel in Zanzibar.', null, 'car'],
            ['why', 'Competitive Prices', 'Direct local pricing with no hidden fees.', null, 'sparkles'],
            ['why', 'Personalized Experiences', 'Tours tailored to families, couples and groups.', null, 'heart'],
            ['why', 'Fast WhatsApp Support', 'Chat with a real human in minutes.', null, 'message'],
            ['why', 'Safe Journeys', 'Insured boats, life vests and trained crew.', null, 'shield'],
            ['testimonial', 'Sophie Laurent', 'Safari Blue was the highlight of our honeymoon. The team took care of every detail — pure magic on the ocean.', 'France', null],
            ['testimonial', 'James Miller', 'Professional, warm and reliable. WhatsApp booking was instant and pickup was exactly on time.', 'United Kingdom', null],
            ['testimonial', 'Amara Okafor', 'The guides made Zanzibar feel like home. We saw dolphins at Mnemba and loved every minute.', 'Nigeria', null],
        ];

        foreach ($items as $index => [$section, $title, $description, $meta, $icon]) {
            HomeContentItem::query()->create(compact('section', 'title', 'description', 'meta', 'icon') + [
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }
}

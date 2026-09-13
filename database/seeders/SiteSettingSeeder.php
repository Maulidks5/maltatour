<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            'general' => [
                ['site_name', 'Website name', 'text', 'Malta Tours and Safari'],
                ['site_tagline', 'Tagline', 'text', 'Discover the Beauty of Zanzibar'],
                ['footer_description', 'Footer description', 'textarea', 'Your trusted local partner for authentic Zanzibar island tours, ocean adventures and unforgettable Tanzania safaris.'],
                ['default_seo_title', 'Default SEO title', 'text', 'Malta Tours and Safari — Zanzibar Tours & Tanzania Safaris'],
                ['default_seo_description', 'Default SEO description', 'textarea', 'Book unforgettable Zanzibar island tours, water sports and Tanzania safaris with Malta Tours and Safari.'],
            ],
            'contact' => [
                ['phone', 'Phone number', 'tel', '+255 772 680 767'],
                ['whatsapp_number', 'WhatsApp number (digits only)', 'text', '255772680767'],
                ['whatsapp_message', 'Default WhatsApp message', 'textarea', 'Hello Malta Tours and Safari, I would like to book a tour.'],
                ['email', 'Email address', 'email', 'info@maltatourtravel.com'],
                ['location', 'Business location', 'text', 'Zanzibar, Tanzania'],
            ],
            'social' => [
                ['facebook_url', 'Facebook URL', 'url', ''],
                ['instagram_url', 'Instagram URL', 'url', ''],
                ['x_url', 'X / Twitter URL', 'url', ''],
                ['youtube_url', 'YouTube URL', 'url', ''],
            ],
            'media' => [
                ['logo_path', 'Website logo', 'image', '/brand/malta-logo.webp'],
                ['hero_image_path', 'Homepage hero image', 'image', '/images/malta-tour-placeholder.jpg'],
                ['cta_image_path', 'Homepage CTA image', 'image', '/images/malta-tour-placeholder.jpg'],
            ],
            'homepage' => [
                ['hero_eyebrow', 'Hero eyebrow', 'text', '🌴 Zanzibar • Tanzania'],
                ['hero_title', 'Hero heading', 'text', 'Discover the Beauty of Zanzibar'],
                ['hero_description', 'Hero description', 'textarea', 'Unforgettable island tours, water adventures and Tanzania safaris designed for every traveller.'],
                ['popular_eyebrow', 'Popular tours eyebrow', 'text', 'Popular Tours'],
                ['popular_title', 'Popular tours heading', 'text', "Zanzibar's most-loved experiences"],
                ['popular_description', 'Popular tours description', 'textarea', 'Handpicked adventures across the islands, forests and coral reefs.'],
                ['categories_title', 'Categories heading', 'text', 'Adventures for every traveller'],
                ['why_title', 'Why choose us heading', 'text', 'Trusted by travellers worldwide'],
                ['testimonials_title', 'Testimonials heading', 'text', 'Stories from our travellers'],
                ['gallery_title', 'Gallery heading', 'text', 'Moments from Zanzibar'],
                ['cta_title', 'Call-to-action heading', 'text', 'Ready to Explore Zanzibar?'],
                ['cta_description', 'Call-to-action description', 'textarea', 'Let our local experts craft your perfect island adventure.'],
                ['contact_title', 'Contact heading', 'text', "Let's plan your trip"],
                ['contact_description', 'Contact description', 'textarea', 'Reach us on any channel — we typically reply within minutes on WhatsApp.'],
            ],
            'pages' => [
                ['tours_eyebrow', 'Tours page eyebrow', 'text', 'Explore Zanzibar'],
                ['tours_title', 'Tours page heading', 'text', 'Tours designed around unforgettable moments'],
                ['tours_description', 'Tours page description', 'textarea', 'Choose an island, cultural, nature or water experience and book directly with our local team.'],
                ['safaris_eyebrow', 'Safaris page eyebrow', 'text', 'Mainland Tanzania'],
                ['safaris_title', 'Safaris page heading', 'text', 'Safari journeys planned around you'],
                ['safaris_description', 'Safaris page description', 'textarea', 'Tell us your dates, preferred parks and travel style. Our team will help shape the right mainland safari package.'],
                ['about_eyebrow', 'About page eyebrow', 'text', 'Your local Zanzibar team'],
                ['about_title', 'About page heading', 'text', 'Meaningful journeys, planned with local care'],
                ['about_description', 'About page introduction', 'textarea', 'Malta Tours and Safari helps travellers discover Zanzibar and Tanzania through well-planned, personal experiences.'],
                ['about_story_title', 'About story heading', 'text', 'More than a tour, a local connection'],
                ['about_story', 'About story', 'textarea', 'From island escapes and cultural visits to ocean adventures and mainland safaris, our goal is to make every part of your journey clear, comfortable and memorable. We listen to how you want to travel, then help shape the right experience around your time, group and interests.'],
                ['contact_page_eyebrow', 'Contact page eyebrow', 'text', 'Talk to our local team'],
                ['contact_page_title', 'Contact page heading', 'text', "Let's plan your Zanzibar experience"],
                ['contact_page_description', 'Contact page introduction', 'textarea', 'Tell us your travel dates, group size and the experiences you are interested in. We will help you with the next steps.'],
            ],
        ];

        foreach ($groups as $group => $settings) {
            foreach ($settings as $index => [$key, $label, $type, $value]) {
                SiteSetting::query()->firstOrCreate(
                    ['key' => $key],
                    compact('group', 'label', 'type', 'value') + ['sort_order' => $index],
                );
            }
        }

        SiteSetting::forgetCache();
    }
}

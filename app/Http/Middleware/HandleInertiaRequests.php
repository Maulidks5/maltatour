<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Models\TourCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = Schema::hasTable('site_settings') ? SiteSetting::publicValues() : [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'isAdmin' => $request->user()->is_admin,
                    'role' => $request->user()->role,
                    'canManageUsers' => $request->user()->can('manage-users'),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'site' => [
                'name' => $settings['site_name'] ?? 'Malta Tours and Safari',
                'tagline' => $settings['site_tagline'] ?? 'Discover the Beauty of Zanzibar',
                'footerDescription' => $settings['footer_description'] ?? '',
                'seoTitle' => $settings['default_seo_title'] ?? 'Malta Tours and Safari',
                'seoDescription' => $settings['default_seo_description'] ?? '',
                'logoPath' => $settings['logo_path'] ?? '/brand/malta-logo.webp',
                'ctaImagePath' => $settings['cta_image_path'] ?? '/images/malta-tour-placeholder.jpg',
                'phone' => $settings['phone'] ?? '+255 772 680 767',
                'whatsappNumber' => $settings['whatsapp_number'] ?? '255772680767',
                'whatsappMessage' => $settings['whatsapp_message'] ?? 'Hello Malta Tours and Safari, I would like to book a tour.',
                'email' => $settings['email'] ?? 'info@maltatourtravel.com',
                'location' => $settings['location'] ?? 'Zanzibar, Tanzania',
                'social' => [
                    'facebook' => $settings['facebook_url'] ?? '',
                    'instagram' => $settings['instagram_url'] ?? '',
                    'twitter' => $settings['x_url'] ?? '',
                    'youtube' => $settings['youtube_url'] ?? '',
                ],
            ],
            'navigation' => [
                'categories' => Schema::hasTable('tour_categories')
                    ? TourCategory::query()
                        ->where('is_active', true)
                        ->where('slug', '!=', 'tanzania-safaris')
                        ->whereHas('tours', fn ($query) => $query->published()->where('experience_type', '!=', 'safari'))
                        ->withCount(['tours' => fn ($query) => $query->published()])
                        ->orderBy('sort_order')
                        ->limit(8)
                        ->get(['name', 'slug', 'description'])
                        ->map(fn (TourCategory $category): array => [
                            'name' => $category->name,
                            'slug' => $category->slug,
                            'description' => $category->description,
                            'count' => $category->tours_count,
                        ])
                    : [],
            ],
        ];
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTourRequest;
use App\Models\Tour;
use App\Models\TourCategory;
use App\Support\WebImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Tours/Index', [
            'tours' => Tour::query()
                ->with('category:id,name')
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Tour $tour): array => [
                    'slug' => $tour->slug,
                    'title' => $tour->title,
                    'category' => $tour->category->name,
                    'type' => $tour->experience_type,
                    'price' => (float) $tour->price,
                    'currency' => $tour->currency,
                    'isPublished' => $tour->is_published,
                    'isPopular' => $tour->is_popular,
                ]),
        ]);
    }

    public function edit(Tour $tour): Response
    {
        $tour->load(['highlights', 'inclusions', 'itineraryItems', 'images']);

        return Inertia::render('Admin/Tours/Edit', [
            'tour' => [
                'id' => $tour->id,
                'tour_category_id' => $tour->tour_category_id,
                'experience_type' => $tour->experience_type,
                'title' => $tour->title,
                'slug' => $tour->slug,
                'excerpt' => $tour->excerpt,
                'description' => $tour->description,
                'duration' => $tour->duration,
                'location' => $tour->location,
                'price' => (float) $tour->price,
                'currency' => $tour->currency,
                'minimum_age' => $tour->minimum_age,
                'difficulty' => $tour->difficulty,
                'pickup_details' => $tour->pickup_details,
                'meta_title' => $tour->meta_title,
                'meta_description' => $tour->meta_description,
                'cover_image_path' => $tour->cover_image_path,
                'is_featured' => $tour->is_featured,
                'is_popular' => $tour->is_popular,
                'is_published' => $tour->is_published,
                'highlights' => $tour->highlights->pluck('label'),
                'included' => $tour->inclusions->where('is_included', true)->pluck('label')->values(),
                'not_included' => $tour->inclusions->where('is_included', false)->pluck('label')->values(),
                'itinerary' => $tour->itineraryItems->map(fn ($item): array => [
                    'time' => $item->time_label,
                    'title' => $item->title,
                    'description' => $item->description,
                ]),
                'images' => $tour->images->map(fn ($image): array => [
                    'id' => $image->id,
                    'path' => $image->path,
                    'alt_text' => $image->alt_text,
                    'sort_order' => $image->sort_order,
                ]),
            ],
            'categories' => TourCategory::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tours/Create', [
            'categories' => TourCategory::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name']),
        ]);
    }

    public function store(UpdateTourRequest $request, WebImageStorage $images): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_popular'] = $request->boolean('is_popular');
        $data['is_published'] = $request->boolean('is_published');
        $data['sort_order'] = ((int) Tour::query()->max('sort_order')) + 1;

        $tour = Tour::query()->create($data);

        if ($request->hasFile('cover_image')) {
            $path = $images->store($request->file('cover_image'), "tours/{$tour->id}");
            $tour->update(['cover_image_path' => '/storage/'.$path]);
        }

        return to_route('admin.tours.edit', $tour)->with('success', 'Tour created. You can now add highlights, itinerary and gallery images.');
    }

    public function update(UpdateTourRequest $request, Tour $tour, WebImageStorage $images): RedirectResponse
    {
        $data = $request->safe()->except('cover_image');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_popular'] = $request->boolean('is_popular');
        $data['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('cover_image')) {
            if (Str::startsWith((string) $tour->cover_image_path, '/storage/')) {
                Storage::disk('public')->delete(Str::after($tour->cover_image_path, '/storage/'));
            }

            $path = $images->store($request->file('cover_image'), "tours/{$tour->id}");
            $data['cover_image_path'] = '/storage/'.$path;
        }

        $tour->update($data);

        return to_route('admin.tours.edit', $tour)->with('success', 'Tour updated successfully.');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    protected $fillable = [
        'tour_category_id',
        'experience_type',
        'title',
        'slug',
        'excerpt',
        'description',
        'duration',
        'location',
        'price',
        'currency',
        'rating',
        'reviews_count',
        'cover_image_path',
        'pickup_details',
        'minimum_age',
        'difficulty',
        'is_featured',
        'is_popular',
        'is_published',
        'sort_order',
        'meta_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'rating' => 'decimal:1',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_published' => 'boolean',
            'minimum_age' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TourCategory::class, 'tour_category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(TourImage::class)->orderBy('sort_order');
    }

    public function highlights(): HasMany
    {
        return $this->hasMany(TourHighlight::class)->orderBy('sort_order');
    }

    public function inclusions(): HasMany
    {
        return $this->hasMany(TourInclusion::class)->orderBy('sort_order');
    }

    public function itineraryItems(): HasMany
    {
        return $this->hasMany(TourItineraryItem::class)->orderBy('sort_order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'tour_id',
        'quoted_price',
        'quoted_currency',
        'reference',
        'full_name',
        'email',
        'whatsapp',
        'travel_date',
        'adults',
        'children',
        'hotel',
        'special_requests',
        'admin_notes',
        'status',
        'source',
        'contacted_at',
        'confirmed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'travel_date' => 'date',
            'adults' => 'integer',
            'children' => 'integer',
            'quoted_price' => 'decimal:2',
            'contacted_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}

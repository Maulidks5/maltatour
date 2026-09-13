<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['reference', 'name', 'email', 'country', 'tour_name', 'rating', 'content', 'status', 'is_featured', 'approved_at'];

    protected function casts(): array
    {
        return ['is_featured' => 'boolean', 'approved_at' => 'datetime'];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }
}

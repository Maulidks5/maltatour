<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTourRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        $tour = $this->route('tour');

        return [
            'tour_category_id' => ['required', 'integer', 'exists:tour_categories,id'],
            'experience_type' => ['required', Rule::in(['zanzibar_tour', 'water_sport', 'safari'])],
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'alpha_dash', 'max:180', Rule::unique('tours', 'slug')->ignore($tour)],
            'excerpt' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string', 'max:10000'],
            'duration' => ['required', 'string', 'max:80'],
            'location' => ['required', 'string', 'max:160'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'currency' => ['required', Rule::in(['USD', 'TZS', 'EUR'])],
            'minimum_age' => ['nullable', 'integer', 'min:0', 'max:100'],
            'difficulty' => ['nullable', Rule::in(['Easy', 'Moderate', 'Advanced', 'Varies'])],
            'pickup_details' => ['nullable', 'string', 'max:3000'],
            'meta_title' => ['nullable', 'string', 'max:190'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_featured' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }
}

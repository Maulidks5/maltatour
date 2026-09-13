<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Feedback');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'country' => ['nullable', 'string', 'max:100'],
            'tour_name' => ['nullable', 'string', 'max:150'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'content' => ['required', 'string', 'min:20', 'max:1500'],
            'website' => ['nullable', 'max:0'],
        ]);

        unset($validated['website']);
        Testimonial::query()->create($validated + [
            'reference' => 'REV-'.now()->format('ymd').'-'.Str::upper(Str::random(5)),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Thank you. Your feedback was received and will be reviewed before publishing.');
    }
}

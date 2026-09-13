<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::query()
                ->when(in_array($status, ['pending', 'approved', 'rejected'], true), fn ($query) => $query->where('status', $status))
                ->latest()
                ->paginate(20)
                ->withQueryString()
                ->through(fn (Testimonial $item): array => [
                    'reference' => $item->reference, 'name' => $item->name, 'email' => $item->email,
                    'country' => $item->country, 'tourName' => $item->tour_name, 'rating' => $item->rating,
                    'content' => $item->content, 'status' => $item->status, 'isFeatured' => $item->is_featured,
                    'createdAt' => $item->created_at->format('M j, Y H:i'),
                ]),
            'activeStatus' => $status,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'is_featured' => ['required', 'boolean'],
        ]);
        $testimonial->update($validated + [
            'approved_at' => $validated['status'] === 'approved' ? ($testimonial->approved_at ?? now()) : null,
        ]);

        return back()->with('success', "Review {$testimonial->reference} updated.");
    }
}

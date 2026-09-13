<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => Booking::query()
                ->with('tour:id,title')
                ->when($status, fn ($query) => $query->where('status', $status))
                ->latest()
                ->paginate(20)
                ->withQueryString()
                ->through(fn (Booking $booking): array => [
                    'reference' => $booking->reference,
                    'fullName' => $booking->full_name,
                    'whatsapp' => $booking->whatsapp,
                    'email' => $booking->email,
                    'tour' => $booking->tour->title,
                    'travelDate' => $booking->travel_date->format('M j, Y'),
                    'guests' => $booking->adults + $booking->children,
                    'hotel' => $booking->hotel,
                    'requests' => $booking->special_requests,
                    'status' => $booking->status,
                    'createdAt' => $booking->created_at->format('M j, Y H:i'),
                ]),
            'activeStatus' => $status ?: null,
            'statuses' => ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'],
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load('tour:id,title,slug,cover_image_path');

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => [
                'reference' => $booking->reference,
                'fullName' => $booking->full_name,
                'email' => $booking->email,
                'whatsapp' => $booking->whatsapp,
                'travelDate' => $booking->travel_date->format('F j, Y'),
                'adults' => $booking->adults,
                'children' => $booking->children,
                'hotel' => $booking->hotel,
                'specialRequests' => $booking->special_requests,
                'adminNotes' => $booking->admin_notes,
                'status' => $booking->status,
                'quotedPrice' => $booking->quoted_price ? (float) $booking->quoted_price : null,
                'quotedCurrency' => $booking->quoted_currency,
                'source' => $booking->source,
                'createdAt' => $booking->created_at->format('F j, Y \a\t H:i'),
                'contactedAt' => $booking->contacted_at?->format('F j, Y \a\t H:i'),
                'confirmedAt' => $booking->confirmed_at?->format('F j, Y \a\t H:i'),
                'cancelledAt' => $booking->cancelled_at?->format('F j, Y \a\t H:i'),
                'tour' => [
                    'title' => $booking->tour->title,
                    'slug' => $booking->tour->slug,
                    'image' => $booking->tour->cover_image_path,
                ],
            ],
            'statuses' => ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'],
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(['pending', 'contacted', 'confirmed', 'completed', 'cancelled'])],
            'admin_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ]);

        if (isset($validated['status']) && $validated['status'] !== $booking->status) {
            $validated['contacted_at'] = $validated['status'] === 'contacted'
                ? ($booking->contacted_at ?? now())
                : $booking->contacted_at;
            $validated['confirmed_at'] = $validated['status'] === 'confirmed'
                ? ($booking->confirmed_at ?? now())
                : $booking->confirmed_at;
            $validated['cancelled_at'] = $validated['status'] === 'cancelled'
                ? ($booking->cancelled_at ?? now())
                : $booking->cancelled_at;
        }

        $booking->update($validated);

        return back()->with('success', "Booking {$booking->reference} updated.");
    }
}

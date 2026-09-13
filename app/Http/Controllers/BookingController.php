<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Mail\NewBookingNotification;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BookingController extends Controller
{
    public function create(Tour $tour): Response
    {
        abort_unless($tour->is_published, 404);

        return Inertia::render('Bookings/Create', [
            'tour' => [
                'id' => $tour->id,
                'slug' => $tour->slug,
                'title' => $tour->title,
                'description' => $tour->excerpt,
                'duration' => $tour->duration,
                'location' => $tour->location,
                'price' => (float) $tour->price,
                'currency' => $tour->currency,
                'image' => $tour->cover_image_path ?: '/images/malta-tour-placeholder.jpg',
            ],
        ]);
    }

    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $data = collect($request->validated())->except(['consent', 'website'])->all();
        $tour = Tour::query()->published()->findOrFail($data['tour_id']);

        $booking = $tour->bookings()->create([
            ...$data,
            'quoted_price' => $tour->price > 0 ? $tour->price : null,
            'quoted_currency' => $tour->price > 0 ? $tour->currency : null,
            'reference' => $this->newReference(),
            'status' => 'pending',
            'source' => 'website',
        ]);

        $booking->setRelation('tour', $tour);

        try {
            Mail::to(config('mail.notification_address'))->send(new NewBookingNotification($booking));
        } catch (Throwable $exception) {
            report($exception);
        }

        return to_route('bookings.success', $booking);
    }

    public function success(Booking $booking): Response
    {
        $booking->load('tour:id,title,slug');

        return Inertia::render('Bookings/Success', [
            'booking' => [
                'reference' => $booking->reference,
                'tourTitle' => $booking->tour->title,
                'tourSlug' => $booking->tour->slug,
                'travelDate' => $booking->travel_date->format('F j, Y'),
                'adults' => $booking->adults,
                'children' => $booking->children,
                'quotedPrice' => $booking->quoted_price ? (float) $booking->quoted_price : null,
                'quotedCurrency' => $booking->quoted_currency,
            ],
        ]);
    }

    private function newReference(): string
    {
        do {
            $reference = 'MTS-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (Booking::query()->where('reference', $reference)->exists());

        return $reference;
    }
}

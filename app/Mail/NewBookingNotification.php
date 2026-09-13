<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewBookingNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: $this->booking->email ? [new Address($this->booking->email, $this->booking->full_name)] : [],
            subject: "New booking {$this->booking->reference} — {$this->booking->tour->title}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-booking');
    }
}

<?php

namespace App\Mail;

use App\Models\ContactInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContactInquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactInquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->inquiry->email, $this->inquiry->name)],
            subject: "New website message {$this->inquiry->reference} — {$this->inquiry->subject}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.new-contact-inquiry');
    }
}

<?php

namespace App\Http\Controllers;

use App\Mail\NewContactInquiryNotification;
use App\Models\ContactInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ContactInquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'subject' => ['required', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
            'website' => ['nullable', 'max:0'],
        ]);

        unset($validated['website']);
        $inquiry = ContactInquiry::query()->create($validated + [
            'reference' => 'MSG-'.now()->format('ymd').'-'.Str::upper(Str::random(5)),
            'status' => 'new',
        ]);

        try {
            Mail::to(config('mail.notification_address'))->send(new NewContactInquiryNotification($inquiry));
        } catch (Throwable $exception) {
            report($exception);
        }

        return back()->with('success', 'Thank you. Your message has been sent to our team.');
    }
}

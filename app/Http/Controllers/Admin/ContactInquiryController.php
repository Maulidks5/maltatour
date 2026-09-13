<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactInquiryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => ContactInquiry::query()->latest()->paginate(25)->through(fn (ContactInquiry $item): array => [
                'reference' => $item->reference, 'name' => $item->name, 'email' => $item->email,
                'subject' => $item->subject, 'message' => $item->message, 'status' => $item->status,
                'createdAt' => $item->created_at->format('M j, Y H:i'),
            ]),
        ]);
    }

    public function update(Request $request, ContactInquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(['new', 'read', 'replied', 'archived'])]]);
        $inquiry->update($validated + ['read_at' => $validated['status'] !== 'new' ? ($inquiry->read_at ?? now()) : null]);
        return back()->with('success', "Message {$inquiry->reference} updated.");
    }
}

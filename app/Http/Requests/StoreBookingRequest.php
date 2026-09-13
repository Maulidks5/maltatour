<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => trim((string) $this->input('full_name')),
            'email' => $this->filled('email') ? trim((string) $this->input('email')) : null,
            'whatsapp' => trim((string) $this->input('whatsapp')),
            'hotel' => $this->filled('hotel') ? trim((string) $this->input('hotel')) : null,
            'special_requests' => $this->filled('special_requests')
                ? trim((string) $this->input('special_requests'))
                : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'tour_id' => ['required', 'integer', 'exists:tours,id'],
            'full_name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['nullable', 'email:rfc', 'max:190'],
            'whatsapp' => ['required', 'string', 'min:7', 'max:40', 'regex:/^[0-9+()\\-\\s]+$/'],
            'travel_date' => ['required', 'date', 'after_or_equal:today', 'before_or_equal:'.now()->addYears(2)->toDateString()],
            'adults' => ['required', 'integer', 'min:1', 'max:30'],
            'children' => ['required', 'integer', 'min:0', 'max:20'],
            'hotel' => ['nullable', 'string', 'max:190'],
            'special_requests' => ['nullable', 'string', 'max:1500'],
            'consent' => ['accepted'],
            'website' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp.regex' => 'Enter a valid WhatsApp number.',
            'travel_date.after_or_equal' => 'Choose today or a future travel date.',
        ];
    }
}

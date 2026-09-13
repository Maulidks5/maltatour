<!doctype html>
<html lang="en"><body style="margin:0;background:#f4f7fa;font-family:Arial,sans-serif;color:#14213d">
<div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
<div style="background:#123b5d;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#f6a623">New booking request</div><h1 style="margin:8px 0 0;font-size:24px">{{ $booking->reference }}</h1></div>
<div style="padding:28px"><p style="margin-top:0">A new booking request has been submitted through the website.</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<tr><td style="padding:9px 0;color:#64748b">Guest</td><td style="padding:9px 0;font-weight:bold">{{ $booking->full_name }}</td></tr>
<tr><td style="padding:9px 0;color:#64748b">Tour</td><td style="padding:9px 0;font-weight:bold">{{ $booking->tour->title }}</td></tr>
<tr><td style="padding:9px 0;color:#64748b">Travel date</td><td style="padding:9px 0">{{ $booking->travel_date->format('F j, Y') }}</td></tr>
<tr><td style="padding:9px 0;color:#64748b">Guests</td><td style="padding:9px 0">{{ $booking->adults }} adult(s), {{ $booking->children }} child(ren)</td></tr>
<tr><td style="padding:9px 0;color:#64748b">WhatsApp</td><td style="padding:9px 0"><a href="https://wa.me/{{ preg_replace('/\D+/', '', $booking->whatsapp) }}">{{ $booking->whatsapp }}</a></td></tr>
<tr><td style="padding:9px 0;color:#64748b">Email</td><td style="padding:9px 0">{{ $booking->email ?: 'Not provided' }}</td></tr>
<tr><td style="padding:9px 0;color:#64748b">Hotel</td><td style="padding:9px 0">{{ $booking->hotel ?: 'Not provided' }}</td></tr>
</table>
@if($booking->special_requests)<div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:10px"><strong>Special request</strong><br><span style="white-space:pre-line">{{ $booking->special_requests }}</span></div>@endif
<p style="margin:24px 0 0"><a href="{{ url('/admin/bookings/'.$booking->reference) }}" style="display:inline-block;background:#f68b1f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:9px;font-weight:bold">Open booking in admin</a></p>
</div></div></div></body></html>

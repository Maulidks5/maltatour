<!doctype html>
<html lang="en"><body style="margin:0;background:#f4f7fa;font-family:Arial,sans-serif;color:#14213d">
<div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
<div style="background:#123b5d;padding:24px 28px;color:#fff"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#f6a623">New contact message</div><h1 style="margin:8px 0 0;font-size:24px">{{ $inquiry->subject }}</h1></div>
<div style="padding:28px"><p><strong>From:</strong> {{ $inquiry->name }}</p><p><strong>Email:</strong> <a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></p><p><strong>Reference:</strong> {{ $inquiry->reference }}</p>
<div style="margin-top:20px;padding:18px;background:#f8fafc;border-radius:10px;line-height:1.7;white-space:pre-line">{{ $inquiry->message }}</div>
<p style="margin:24px 0 0"><a href="mailto:{{ $inquiry->email }}?subject={{ rawurlencode('Re: '.$inquiry->subject) }}" style="display:inline-block;background:#f68b1f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:9px;font-weight:bold">Reply to customer</a></p>
</div></div></div></body></html>

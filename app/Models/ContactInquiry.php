<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    protected $fillable = ['reference', 'name', 'email', 'subject', 'message', 'status', 'read_at'];
    protected function casts(): array { return ['read_at' => 'datetime']; }
    public function getRouteKeyName(): string { return 'reference'; }
}

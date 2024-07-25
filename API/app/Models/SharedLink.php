<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedLink extends Model
{
    protected $table = 'shared_links';

    // Fillable properties, allowing mass assignment
    protected $fillable = [
        'token',
        'expires_at',
        'shopping_list_id',
        'can_update',
        'can_delete'
    ];

    // Cast the 'expires_at' field to date
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // Optionally, you can add methods or relationships here
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ShoppingList extends Model
{
    use HasFactory;

    protected $primaryKey = 'list_id'; // Define the primary key

    protected $fillable = [
        'user_id',
        'name',
        'route_id',
    ];

    // Ensure route_id is set uniquely, if necessary
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // If route_id should be generated or managed, you can set it here
            // For example, ensure it's unique or set a default value
            if (is_null($model->route_id)) {
                // Set route_id to a default value or generate a unique one
                $model->route_id = Str::uuid()->toString();
            }
        });
    }

    // Optional: Define relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function route()
    {
        return $this->belongsTo(Route::class, 'route_id');
    }
}

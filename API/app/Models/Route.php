<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $primaryKey = 'route_id';

    protected $fillable = [
        'polyline_data',
    ];

    // Additional model methods or relationships can be defined here
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ShoppingList extends Model
{
    use HasFactory;

    protected $primaryKey = 'list_id';

    protected $fillable = [
        'user_id',
        'name',
        'route_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (is_null($model->route_id)) {
                $model->route_id = null;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function route()
    {
        return $this->belongsTo(Route::class, 'route_id');
    }
}

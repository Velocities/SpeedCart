<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedShoppingListPerm extends Model
{
    protected $table = 'shared_shopping_list_perms';
    protected $fillable = [
      'shopping_list_id',
      'user_id',
      'can_update',
      'can_delete'
    ];
}

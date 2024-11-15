<?php

namespace Database\Factories;

use App\Models\SharedLink;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SharedLinkFactory extends Factory
{
    protected $model = SharedLink::class;

    public function definition()
    {
        return [
            'token' => (string) Str::uuid(),
            'expires_at' => Carbon::now()->addDays(7),
            'can_update' => false,
            'can_delete' => false,
            'shopping_list_id' => function () {
                return \App\Models\ShoppingList::factory()->create()->list_id;
            }
        ];
    }
}
<?php

namespace Database\Factories;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingListFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ShoppingList::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get a random user from the database (can be adjusted based on your needs)
        $user = User::inRandomOrder()->first();

        return [
            'name' => $this->faker->word(), // Random name for the shopping list
            'user_id' => $user ? $user->user_id : null, // Assign a user_id from an existing user
            'route_id' => null, // Set to null if you don't want to assign a route by default
        ];
    }
}

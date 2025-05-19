<?php

namespace Database\Factories;

use App\Models\GroceryItem;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroceryItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GroceryItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get a random user from the database (can be adjusted based on your needs)
        $user = User::inRandomOrder()->first();
        $list = ShoppingList::inRandomOrder()->first();
        return [
            'name' => $this->faker->word(), // Random name for the grocery item
            'is_food' => false,
            'shopping_list_id' => $list->list_id,
        ];
    }
}

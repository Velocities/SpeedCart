<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'user_id' => $this->faker->uuid(),
            'username' => $this->faker->userName(),
            // Add any other necessary fields here
        ];
    }
}

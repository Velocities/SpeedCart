<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use App\Models\Route;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShoppingListControllerTest extends TestCase
{
    // Runs our migrations to set up the in-memory database with all the proper tables
    use RefreshDatabase;

    public function testCreateShoppingList()
    {
        // Create an authenticated user
        $user = User::factory()->create();

        // Mock the login by setting a cookie
        $response = $this->actingAs($user);

        // Make the post request to create a shopping list
        $response = $this->postJson('/shopping-lists', [
            'name' => 'Test Shopping List',
        ]);

        // Assert the response is successful (HTTP 201 created)
        $response->assertStatus(201);

        // Assert the response contains the shopping list name
        $response->assertJsonFragment([
            'name' => 'Test Shopping List',
        ]);

        // Ensure the shopping list is stored in the database
        $this->assertDatabaseHas('shopping_lists', [
            'name' => 'Test Shopping List',
            'user_id' => $user->user_id, // Make sure the user_id matches
        ]);
    }


    public function testGetUserShoppingLists()
    {
        // Create an authenticated user and a shopping list
        $user = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
        ]);

        // Mock the login by setting a cookie
        $response = $this->actingAs($user);

        // Make the get request to fetch shopping lists
        $response = $this->getJson('/shopping-lists');

        // Assert the response is successful (HTTP 200 OK)
        $response->assertStatus(200);

        // Assert the shopping list is in the response
        $response->assertJsonFragment([
            'name' => $list->name,
        ]);
    }

    public function testGetSpecificShoppingList()
    {
        // Create an authenticated user and a shopping list
        $user = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
        ]);

        // Mock the login by setting a cookie
        $response = $this->actingAs($user);

        // Make the get request to fetch a specific shopping list by ID
        $response = $this->getJson('/shopping-lists/' . $list->list_id);

        // Assert the response is successful (HTTP 200 OK)
        $response->assertStatus(200);

        // Assert the specific shopping list is in the response
        $response->assertJsonFragment([
            'name' => $list->name,
        ]);
    }



    public function testDeleteShoppingList()
    {
        // Create an authenticated user and a shopping list
        $user = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
        ]);

        // Mock the login by setting a cookie
        $response = $this->actingAs($user);

        // Make the delete request to remove the shopping list
        $response = $this->deleteJson('/shopping-lists/' . $list->list_id);

        // Assert the response is successful (HTTP 200 OK)
        $response->assertStatus(200);

        // Ensure the shopping list is deleted from the database
        $this->assertDatabaseMissing('shopping_lists', [
            'id' => $list->list_id,
        ]);
    }

}

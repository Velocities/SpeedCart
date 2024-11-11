<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use App\Models\GroceryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroceryItemControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testStoreGroceryItem()
    {
        $user = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $user->user_id]);

        $this->actingAs($user)
            ->postJson('/grocery-items', [
                'name' => 'Apples',
                'quantity' => 5,
                'is_food' => true,
                'shopping_list_id' => $shoppingList->list_id,
            ])
            ->assertStatus(201)
            ->assertJsonFragment(['name' => 'Apples', 'quantity' => 5, 'is_food' => true]);

        $this->assertDatabaseHas('grocery_items', [
            'name' => 'Apples',
            'quantity' => 5,
            'is_food' => true,
            'shopping_list_id' => $shoppingList->list_id,
        ]);
    }

    public function testStoreGroceryItemUnauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $otherUser->user_id]);

        $this->actingAs($user)
            ->postJson('/grocery-items', [
                'name' => 'Bananas',
                'quantity' => 10,
                'is_food' => true,
                'shopping_list_id' => $shoppingList->list_id,
            ])
            ->assertStatus(403);
    }

    public function testShowGroceryItems()
    {
        $user = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $user->user_id]);
        $groceryItem = GroceryItem::factory()->create([
            'name' => 'Oranges',
            'quantity' => 3,
            'is_food' => true,
            'shopping_list_id' => $shoppingList->list_id,
        ]);

        $response = $this->actingAs($user)->getJson('/grocery-items/' . $shoppingList->list_id);

        $response->assertStatus(200);

        $response->assertJsonFragment([
               'name' => 'Oranges',
               'quantity' => 3,
               'is_food' => 1,
        ]);
    }

    public function testShowGroceryItemsUnauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $otherUser->user_id]);

        $this->actingAs($user)
            ->getJson('/grocery-items/' . $shoppingList->list_id)
            ->assertStatus(403);
    }

    public function testUpdateGroceryItem()
    {
        $user = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $user->user_id]);
        $groceryItem = GroceryItem::factory()->create([
            'name' => 'Milk',
            'quantity' => 1,
            'is_food' => true,
            'shopping_list_id' => $shoppingList->list_id,
        ]);

        $this->actingAs($user)
            ->putJson('/grocery-items/' . $groceryItem->item_id, [
                'name' => 'Almond Milk',
                'quantity' => 2,
                'is_food' => true,
            ])
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Almond Milk', 'quantity' => 2, 'is_food' => true]);

        $this->assertDatabaseHas('grocery_items', [
            'item_id' => $groceryItem->item_id,
            'name' => 'Almond Milk',
            'quantity' => 2,
        ]);
    }

    public function testUpdateGroceryItemUnauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $otherUser->user_id]);
        $groceryItem = GroceryItem::factory()->create([
            'shopping_list_id' => $shoppingList->list_id,
            'name' => 'Juice',
        ]);

        $this->actingAs($user)
            ->putJson('/grocery-items/' . $groceryItem->item_id, [
                'name' => 'Orange Juice',
                'quantity' => 2,
                'is_food' => true,
            ])
            ->assertStatus(403);
    }

    public function testDeleteGroceryItem()
    {
        $user = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $user->user_id]);
        $groceryItem = GroceryItem::factory()->create(['shopping_list_id' => $shoppingList->list_id]);

        $this->actingAs($user)
            ->deleteJson('/grocery-items/' . $groceryItem->item_id)
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Grocery item deleted successfully']);

        $this->assertDatabaseMissing('grocery_items', ['item_id' => $groceryItem->item_id]);
    }

    public function testDeleteGroceryItemUnauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $shoppingList = ShoppingList::factory()->create(['user_id' => $otherUser->user_id, 'name' => 'foo']);
        $groceryItem = GroceryItem::factory()->create(['shopping_list_id' => $shoppingList->list_id]);

        $this->actingAs($user)
            ->deleteJson('/grocery-items/' . $groceryItem->item_id)
            ->assertStatus(403);
    }
}

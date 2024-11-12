<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ListPermissionsControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function testCreateShareLink(): void
    {
        $user = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
            'name' => 'Test Shopping List'
        ]);

        $this->actingAs($user);

        $response = $this->postJson('/share/' . $list->list_id);

        $response->assertStatus(200);

        // Verify the database entry with all required fields
        $this->assertDatabaseHas('shared_links', [
            'shopping_list_id' => $list->list_id,
        ]);

        // Verify that all required fields are present
        $sharedLink = \DB::table('shared_links')
            ->where('shopping_list_id', $list->list_id)
            ->first();

        $this->assertNotNull($sharedLink);
        $this->assertNotNull($sharedLink->token);
        $this->assertNotNull($sharedLink->expires_at);
    }

    public function testUnauthorizedUserCannotCreateShareLink(): void
    {
        $owner = User::factory()->create();
        $unauthorizedUser = User::factory()->create();
        
        $list = ShoppingList::factory()->create([
            'user_id' => $owner->user_id
        ]);

        $this->actingAs($unauthorizedUser);

        $response = $this->postJson('/share/' . $list->list_id);
        $response->assertStatus(403);
    }
}
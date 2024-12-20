<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use App\Models\GroceryItem;
use App\Models\SharedLink;
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

    public function test_createShareLink_validListId_returnsNewShareLink(): void
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

    public function test_verifyShareLinkAndSavePerms_validShareLink_savesPermissionsInDatabase(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
            'name' => 'Test Shopping List'
        ]);
        $shareLink = SharedLink::factory()->create([
            'shopping_list_id' => $list->list_id
        ]);

        $response = $this->actingAs($otherUser);

        $response = $this->getJson('/share/' . $shareLink->token);
        
        $response->assertStatus(201);

        // Ensure chosen permissions (default from factory) were properly set
        $this->assertDatabaseHas('shared_shopping_list_perms', [
            'shopping_list_id' => $list->list_id,
            'user_id' => $otherUser->user_id,
            'can_update' => 0,
            'can_delete' => 0
        ]);
    }

    /* Purpose: User A shares list with User B, but User B shouldn't be able to share with
       another user because that isn't okay to User A (only User A should be able to create
       share links for their lists since they own those lists)
    */
    public function test_createShareLink_sharedUserCannotCreateNewShareLink_returns403Error() {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
            'name' => 'Test Shopping List'
        ]);
        $shareLink = SharedLink::factory()->create([
            'shopping_list_id' => $list->list_id
        ]);

        $response = $this->actingAs($otherUser);

        // Verify the first link with otherUser to give them permissions
        $response = $this->getJson('/share/' . $shareLink->token);
        
        // Now try creating another share link as otherUser

        $secondLinkCreationResponse = $this->actingAs($otherUser);

        $secondLinkCreationResponse = $this->postJson('/share/' . $list->list_id);

        $secondLinkCreationResponse->assertStatus(403);

        // Ensure chosen permissions (default from factory) were NOT properly set
        $this->assertDatabaseMissing('shared_links', [
            'shopping_list_id' => $list->list_id,
            'can_update' => 0,
            'can_delete' => 0
        ]);
    }

    public function test_verifyShareLinkAndSavePerms_updateAllowedButNotDelete_returns403ErrorForDeleteAttempt() {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
            'name' => 'Test Shopping List'
        ]);
        $shareLink = SharedLink::factory()->create([
            'shopping_list_id' => $list->list_id,
            'can_update' => 1
        ]);

        $response = $this->actingAs($otherUser);

        // Verify the first link with otherUser to give them permissions
        $response = $this->getJson('/share/' . $shareLink->token);
        
        // Now try CRUD operations with Controllers but DELETE should fail

        // Title update
        $titleUpdateResponse = $this->actingAs($otherUser);
        $titleUpdateResponse = $this->putJson('/shopping-lists/' . $list->list_id, [
            'name' => 'foo2',
        ]);
        $titleUpdateResponse->assertStatus(200);

        // Item creation
        $listItemCreationResponse = $this->actingAs($otherUser);
        $listItemCreationResponse = $this->postJson('/grocery-items', [
            'name' => 'Bananas',
            'quantity' => 10,
            'is_food' => true,
            'shopping_list_id' => $list->list_id,
        ]);

        $listItemCreationResponse->assertStatus(201);
        $listItemCreationResponseJson = $listItemCreationResponse->json();
        
        // Delete an item (fabricate via Factory)
        // TBD = To Be Deleted
        $listItemTBD = GroceryItem::factory()->create([
            'shopping_list_id' => $list->list_id
        ]);

        $listItemTBDResponse = $this->actingAs($otherUser);
        $listItemTBDResponse = $this->deleteJson('/grocery-items/' . $listItemTBD->item_id);
        $listItemTBDResponse->assertStatus(200);
        $this->assertDatabaseMissing('grocery_items', [
            'shopping_list_id', $list->list_id,
            'item_id' => $listItemTBD->item_id
        ]);

        // Deletion which should fail
        $listDeleteResponse = $this->actingAs($otherUser);
        $listDeleteResponse = $this->deleteJson('/shopping-lists/' . $list->list_id);

        $listDeleteResponse->assertStatus(403);

        // Ensure content was preserved in all tables involved
        $this->assertDatabaseHas('shopping_lists', [
            'list_id' => $list->list_id,
            'user_id' => $user->user_id
        ]);

        $this->assertDatabaseHas('grocery_items', [
            'shopping_list_id' => $list->list_id,
            'item_id' => $listItemCreationResponseJson['item_id']
        ]);
    }

    public function test_verifyShareLinkAndSavePerms_deleteAllowedButNotUpdate_returns403ErrorForUpdateAttempt() {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $list = ShoppingList::factory()->create([
            'user_id' => $user->user_id,
            'name' => 'Test Shopping List'
        ]);
        $shareLink = SharedLink::factory()->create([
            'shopping_list_id' => $list->list_id,
            'can_delete' => 1
        ]);

        $response = $this->actingAs($otherUser);

        // Verify the first link with otherUser to give them permissions
        $response = $this->getJson('/share/' . $shareLink->token);
        
        // Now try CRUD operations with Controllers but UPDATE should fail

        // Title update
        $titleUpdateResponse = $this->actingAs($otherUser);
        $titleUpdateResponse = $this->putJson('/shopping-lists/' . $list->list_id, [
            'name' => 'foo2',
        ]);
        $titleUpdateResponse->assertStatus(403);
        $this->assertDatabaseMissing('grocery_items', [
            'name' => 'foo2',
        ]);

        // Item creation
        $listItemCreationResponse = $this->actingAs($otherUser);
        $listItemCreationResponse = $this->postJson('/grocery-items', [
            'name' => 'Bananas',
            'quantity' => 10,
            'is_food' => true,
            'shopping_list_id' => $list->list_id,
        ]);

        $listItemCreationResponse->assertStatus(403);
        
        // Try to delete an item (fabricate via Factory); THIS REQUEST SHOULD FAIL!
        // TBD = To Be Deleted
        $listItemTBD = GroceryItem::factory()->create([
            'shopping_list_id' => $list->list_id,
            'name' => 'stick around'
        ]);

        $listItemTBDResponse = $this->actingAs($otherUser);
        $listItemTBDResponse = $this->deleteJson('/grocery-items/' . $listItemTBD->item_id);
        $listItemTBDResponse->assertStatus(403);
        $this->assertDatabaseHas('grocery_items', [
            'shopping_list_id' => $list->list_id,
            'name' => 'stick around'
        ]);
        

        // Deletion which should succeed (since we're deleting the list)
        $listDeleteResponse = $this->actingAs($otherUser);
        $listDeleteResponse = $this->deleteJson('/shopping-lists/' . $list->list_id);

        $listDeleteResponse->assertStatus(200);

        // Ensure content was deleted in all tables involved
        $this->assertDatabaseMissing('shopping_lists', [
            'list_id' => $list->list_id,
            'user_id' => $user->user_id
        ]);

        // There should be NO ITEMS REMAINING since the list was deleted
        $this->assertDatabaseMissing('grocery_items', [
            'shopping_list_id' => $list->list_id,
        ]);
    }

    public function test_createShareLink_unauthorizedUser_returns403Error(): void
    {
        $owner = User::factory()->create();
        $unauthorizedUser = User::factory()->create();
        
        $list = ShoppingList::factory()->create([
            'user_id' => $owner->user_id
        ]);

        $this->actingAs($unauthorizedUser);

        $response = $this->postJson('/share/' . $list->list_id);
        $response->assertStatus(403);

        // Ensure chosen permissions (default from factory) were NOT properly set
        $this->assertDatabaseMissing('shared_shopping_list_perms', [
            'shopping_list_id' => $list->list_id,
            'user_id' => $unauthorizedUser->user_id,
            'can_update' => 0,
            'can_delete' => 0
        ]);
    }
}

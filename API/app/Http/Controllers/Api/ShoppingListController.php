<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// Our custom controller for sharing functionality (creating a link or verifying one) for lists
// (some lists may be shared rather than owned, so this is needed to make sharing happen)
use App\Http\Controllers\ListPermissionsController;

use App\Models\ShoppingList;
use App\Models\SharedShoppingListPerm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Route;
use Illuminate\Support\Facades\Schema; // Necessary for debugging the schema
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

define('DEBUG_MODE', 0);


class ShoppingListController extends Controller
{
    use AuthorizesRequests;
    
    // Note: No index method necessary (doesn't make sense for SpeedCart)

    public function store(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        // Grab user from sanctum
        $user = Auth::user();
        
        if (DEBUG_MODE) {
            Log::info("User ID retrieved from JWT: " . print_r($user->user_id, true));
        }
        
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string',
            'route_id' => 'nullable|integer', // Validate route_id as nullable and a valid UUID
        ]);

        Log::info("Validated request: " . print_r($validatedData, true));

        // Check if route_id exists (if provided)
        if (!empty($validatedData['route_id'])) {
            $route = DB::table('routes')->where('id', $validatedData['route_id'])->first();
            if (!$route) {
                Log::error("Route ID {$validatedData['route_id']} does not exist.");
                return response()->json(['error' => 'Invalid route_id'], 400);
            }
        }

        // Generate a UUID for route_id if not provided
        if (empty($validatedData['route_id'])) {
            $validatedData['route_id'] = null;
        }

        $newEntry = [
            'user_id' => $user->user_id,
            'name' => $validatedData['name'],
            'route_id' => $validatedData['route_id'],
        ];

        Log::info("Entering new entry into Shopping List database: " . print_r($newEntry, true));
        if ($newEntry['route_id'] === NULL) {
            Log::info("route_id is NULL");
        }

        try {
            $shoppingList = ShoppingList::create($newEntry);
            Log::info("Created shopping list: " . $shoppingList);
        } catch (\Exception $e) {
            Log::error("Error creating shopping list: " . $e->getMessage());
            return response()->json(['error' => 'Could not create shopping list'], 500);
        }

        return response()->json($shoppingList, 201);
    }


    public function show(Request $request, $id)
    {

        $shoppingList = ShoppingList::findOrFail($id);

        // This will automatically call the `view` method in the ShoppingListPolicy
        $this->authorize('view', $shoppingList); // Throws a 403 if not authorized

        return response()->json($shoppingList, 200);
    }

    // This will be used for the dashboard page for any given user (OWNED LISTS)
    public function getUserShoppingLists(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        $user = Auth::user();
        if ($user) {
            Log::info("Got user from Auth facade: ".$user);
        } else {
            Log::info("COULDN'T GET USER FROM AUTH FACADE");
        }

        if (DEBUG_MODE) {
            Log::info("User ID retrieved from sanctum: " . print_r($user->user_id, true));
        }
        $shoppingLists = ShoppingList::where('user_id', $user->user_id)->get(['list_id', 'name', 'updated_at']); // Retrieve only the necessary fields
        return response()->json($shoppingLists, 200);
    }

    // This will be used for the dashboard page for any given user (SHARED LISTS)
    public function getSharedShoppingLists(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        // Grab user from sanctum
        $user = Auth::user();

        if (DEBUG_MODE) {
            Log::info("User ID retrieved from sanctum: " . print_r($user->user_id, true));
        }

        // Step 1: Get all permission entries for the given user
        $sharedPermissionEntries = SharedShoppingListPerm::where('user_id', $user->user_id);
        
        // Step 2: Extract shopping list IDs from the permissions
        $shoppingListIds = $sharedPermissionEntries->pluck('shopping_list_id');

        // Step 3: Retrieve shopping lists based on the IDs
        $shoppingLists = ShoppingList::whereIn('id', $shoppingListIds)->get();

        return response()->json($shoppingLists, 200);
    }

    public function update(Request $request, $id)
    {
        // Validate request
        $validatedData = $request->validate([
            'name' => 'required|string',
        ]);
    
        // Find the shopping list by ID and update the name
        $shoppingList = ShoppingList::findOrFail($id);

        // This will automatically call the `update` method in the ShoppingListPolicy
        $this->authorize('update', $shoppingList); // Throws a 403 if not authorized
        
        $shoppingList->name = $validatedData['name'];
        $shoppingList->save();
    
        return response()->json($shoppingList, 200);
    }

    public function destroy(Request $request, $id)
    {
        try {
            $shoppingList = ShoppingList::findOrFail($id);

            // This will automatically call the `delete` method in the ShoppingListPolicy
            $this->authorize('delete', $shoppingList); // Throws a 403 if not authorized
        
            $shoppingList->delete();

            return response()->json(['message' => 'Shopping list deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting shopping list: ' . $e->getMessage());
            return response()->json(['error' => 'Could not delete shopping list'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingList;
use App\Models\SharedLink;
use App\Models\SharedShoppingListPerm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Route; // Import the Route model
use Illuminate\Support\Facades\Schema; // Necessary for debugging the schema



class ShoppingListController extends Controller
{
    public function index()
    {
        return response()->json(ShoppingList::all(), 200);
    }

    public function share($id, Request $request)
    {
        $shoppingList = ShoppingList::findOrFail($id);
        Log::info("Shopping list id: " . $shoppingList->list_id . " and we started with id: " . $id);
        //Log::info("shoppingList object: " . print_r($shoppingList, true));

        $maxRetries = 10; // Maximum number of retries
        $retryCount = 0;

        do {
            $token = (string) Str::uuid();
            $exists = SharedLink::where('token', $token)->exists();
            $retryCount++;
        } while ($exists && $retryCount < $maxRetries);

        if ($exists) {
            // If a unique token could not be generated, handle the error
            return response()->json(['error' => 'Unable to generate a unique link. Please try again later.'], 500);
        }

        // Extract permissions from request
        $canUpdate = $request->can_update ?? false;
        $canDelete = $request->can_delete ?? false;

        Log::info("canUpdate: " . $canUpdate);
        Log::info("canDelete: " . $canDelete);


        // Store the link with the shopping list ID and permissions
        SharedLink::create([
            'shopping_list_id' => $shoppingList->list_id,
            'token' => $token,
            'expires_at' => now()->addDays(7), // Optional: set expiration date
            'can_update' => $canUpdate,
            'can_delete' => $canDelete,
        ]);

        // Create the full URL with the domain
        $url = "https://www.speedcartapp.com/share/$token";

        return response()->json(['link' => $url]);
    }

    public function verifyShare($token, Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        // Retrieve the shared link
        $sharedLink = SharedLink::where('token', $token)->first();

        // Check if the link exists
        if (!$sharedLink) {
            abort(404, 'Link not found');
        }
        Log::info("LINK WAS FOUND!");

        // Check if the link is expired
        if (now()->greaterThan($sharedLink->expires_at)) {
            Log::info("Link has expired");
            // Remove the expired link from the database
            SharedLink::where('token', $token)->delete();
            abort(403, 'Link expired');
        }

        Log::info("Retrieving shopping list with id " . $sharedLink->shopping_list_id);

        // Retrieve the shopping list
        $shoppingList = ShoppingList::findOrFail($sharedLink->shopping_list_id);

        Log::info("Got shopping list!");

        // Here, you may want to update the permissions for the user or perform any other actions
        // For instance, you might want to set permissions for the user, if applicable.
        $currentUserId = $request->user_id; // Assuming the user is authenticated

        if ($currentUserId) {
            Log::info("Setting user permissions for user: " . $currentUserId);
            // Create or update the permission record
            SharedShoppingListPerm::updateOrCreate(
                ['shopping_list_id' => $shoppingList->list_id, 'user_id' => $currentUserId],
                [
                    'shopping_list_id' => $shoppingList->list_id,
                    'user_id' => $currentUserId,
                    'can_update' => $sharedLink->can_update,
                    'can_delete' => $sharedLink->can_delete,
                ]
            );
        }
        // Remove the used link from the database
        SharedLink::where('token', $token)->delete();

        // Retrieve the shopping list
        $shoppingList = ShoppingList::findOrFail($sharedLink->shopping_list_id);

        return response()->json($shoppingList, 201);
    }

    public function store(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        $userId = $request->user_id;

        Log::info("User ID retrieved from JWT: " . print_r($userId, true));

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
            'user_id' => $userId,
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

        // Authorize user
        $userId = $request->user_id;

        if (strcmp($shoppingList->user_id, $userId)) {
            // Check if they have permissions for this list in the permissions table
            if (SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)->where('user_id', $userId)) {
                return response()->json($shoppingList, 200);
            } else {
                return response()->json(["errorMessage" => "Unauthorized Request"], 403);
            }
        }
        return response()->json($shoppingList, 200);
    }

    // This will be used for the dashboard page for any given user
    public function getUserShoppingLists(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        $userId = $request->user_id;

        Log::info("User ID retrieved from JWT: " . print_r($userId, true));
        $shoppingLists = ShoppingList::where('user_id', $userId)->get(['list_id', 'name', 'updated_at']); // Retrieve only the necessary fields
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

        // Authorize user
        $userId = $request->user_id;
        
        // Sharing will be a feature added here later
        if (strcmp($shoppingList->user_id, $userId)) {
            return response()->json(["errorMessage" => "Unauthorized Request"], 403);
        }
        
        $shoppingList->name = $validatedData['name'];
        $shoppingList->save();
    
        return response()->json($shoppingList, 200);
    }
    

    /*public function destroy(ShoppingList $shoppingList)
    {
        $shoppingList->delete();
        return response()->json(null, 204);
    }*/

    public function destroy(Request $request, $id)
    {
        try {
            $shoppingList = ShoppingList::findOrFail($id);

            // Authorize user
            $userId = $request->user_id;

            // Sharing will be a feature added here later
            if (strcmp($shoppingList->user_id, $userId)) {
                return response()->json(["errorMessage" => "Unauthorized Request"], 403);
            }
            $shoppingList->delete();

            return response()->json(['message' => 'Shopping list deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting shopping list: ' . $e->getMessage());
            return response()->json(['error' => 'Could not delete shopping list'], 500);
        }
    }
}

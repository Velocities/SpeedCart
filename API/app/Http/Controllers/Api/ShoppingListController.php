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
use Illuminate\Support\Facades\Auth;



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

        // Grab user from sanctum
        $user = Auth::user();

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
        $currentUserId = $user->user_id; // Assuming the user is authenticated

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

        // Grab user from sanctum
        $user = Auth::user();

        Log::info("User ID retrieved from JWT: " . print_r($user->user_id, true));

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

        // Grab user from sanctum
        $user = Auth::user();

        if (strcmp($shoppingList->user_id, $user->user_id)) {
            // Check if they have permissions for this list in the permissions table
            if (SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)->where('user_id', $user->user_id)) {
                return response()->json($shoppingList, 200);
            } else {
                return response()->json(["errorMessage" => "Unauthorized Request"], 403);
            }
        }
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


        Log::info("User ID retrieved from sanctum: " . print_r($user->user_id, true));
        $shoppingLists = ShoppingList::where('user_id', $user->user_id)->get(['list_id', 'name', 'updated_at']); // Retrieve only the necessary fields
        return response()->json($shoppingLists, 200);
    }

    // This will be used for the dashboard page for any given user (SHARED LISTS)
    public function getSharedShoppingLists(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        // Grab user from sanctum
        $user = Auth::user();

        Log::info("User ID retrieved from sanctum: " . print_r($user->user_id, true));

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

        // Grab user from sanctum
        $user = Auth::user();

        // NEW CODE HASN'T BEEN TESTED (see Git on left side in VSCode for untested blocks)
        $sharedPermissionEntry = SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)
            ->where('user_id', $user->user_id)
            ->first(); // Retrieves the first matching entry or null if none found
        // (THERE SHOULD BE AT MOST ONE ENTRY RETURNED, which is why ->first() should work)
        
        // Sharing will be a feature added here later
        if (strcmp($shoppingList->user_id, $user->user_id)) {
            // User isn't owner; check if user has delete permissions via share table
            if ($sharedPermissionEntry) {
                if ($sharedPermissionEntry->can_update) {
                    // User has delete permission; delete the list title (items deleted via CASCADE deletion behavior)
                    $shoppingList->delete();

                    return response()->json(['message' => 'Shopping list deleted successfully'], 200);
                }
            }
            return response()->json(["errorMessage" => "Unauthorized Request"], 403);
        }
        
        $shoppingList->name = $validatedData['name'];
        $shoppingList->save();
    
        return response()->json($shoppingList, 200);
    }

    public function destroy(Request $request, $id)
    {
        try {
            $shoppingList = ShoppingList::findOrFail($id);

            // Grab user from sanctum
            $user = Auth::user();
            // NEW CODE HASN'T BEEN TESTED (see Git on left side in VSCode for untested blocks)
            $sharedPermissionEntry = SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)
                ->where('user_id', $user->user_id)
                ->first(); // Retrieves the first matching entry or null if none found
            // (THERE SHOULD BE AT MOST ONE ENTRY RETURNED, which is why ->first() should work)

            // Sharing will be a feature added here later
            if (strcmp($shoppingList->user_id, $user->user_id)) {
                // User isn't owner; check if user has delete permissions via share table
                if ($sharedPermissionEntry) {
                    if ($sharedPermissionEntry->can_delete) {
                        // User has delete permission; delete the list title (items deleted via CASCADE deletion behavior)
                        $shoppingList->delete();

                        return response()->json(['message' => 'Shopping list deleted successfully'], 200);
                    }
                }
                return response()->json(["errorMessage" => "Unauthorized Request"], 403);
                //return response()->json(['message' => 'Shopping list deleted successfully'], 200);
            }
            $shoppingList->delete();

            return response()->json(['message' => 'Shopping list deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting shopping list: ' . $e->getMessage());
            return response()->json(['error' => 'Could not delete shopping list'], 500);
        }
    }
}

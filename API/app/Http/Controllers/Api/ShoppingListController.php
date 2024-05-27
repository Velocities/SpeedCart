<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingList;
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

        // Check if user_id exists
        /*$user = DB::table('users')->where('id', $userId)->first();
        if (!$user) {
            Log::error("User ID $userId does not exist.");
            return response()->json(['error' => 'Invalid user_id'], 400);
        }*/

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


    public function show(ShoppingList $shoppingList)
    {
        return response()->json($shoppingList, 200);
    }

    // This will be used for the dashboard page for any given user
    public function getUserShoppingLists(Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        $userId = $request->user_id;

        Log::info("User ID retrieved from JWT: " . print_r($userId, true));
        $shoppingLists = ShoppingList::where('user_id', $userId)->get(['list_id', 'name']); // Retrieve only the necessary fields
        return response()->json($shoppingLists, 200);
    }


    public function update(Request $request, ShoppingList $shoppingList)
    {
        $request->validate([
            'name' => 'required|string',
            'route_id' => 'nullable|exists:routes,route_id',
        ]);

        $shoppingList->update($request->all());
        return response()->json($shoppingList, 200);
    }

    /*public function destroy(ShoppingList $shoppingList)
    {
        $shoppingList->delete();
        return response()->json(null, 204);
    }*/

    public function destroy($id)
    {
        try {
            $shoppingList = ShoppingList::findOrFail($id);
            $shoppingList->delete();

            return response()->json(['message' => 'Shopping list deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting shopping list: ' . $e->getMessage());
            return response()->json(['error' => 'Could not delete shopping list'], 500);
        }
    }
}

<?php

// app/Http/Controllers/Api/ShoppingListController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema; // Necessary for debugging the database schema

use Illuminate\Support\Facades\Log;


class ShoppingListController extends Controller
{
    // Below are all CRUD operations

    public function index()
    {
        return response()->json(ShoppingList::all(), 200);
    }
    
    public function store(Request $request)
    {
        Log::info("Received shopping-lists request from ip address " . $request->ip());

        // Retrieve user ID from JWT token
        $userId = $request->user_id;

        Log::info("user ID retrieved from JWT: " . print_r($userId, true));

        $request->validate([
            'name' => 'required|string',
            'route_id' => 'nullable|exists:routes,route_id',
        ]);

        Log::info("Schema for Shopping List database: ");

        // Log the schema of the users table
        $columns = Schema::getColumnListing('shopping_lists');
        foreach ($columns as $column) {
            $type = Schema::getColumnType('shopping_lists', $column);
            Log::info("{$column}: {$type}");
        }

        // Include the retrieved user ID when creating the shopping list
        $shoppingList = ShoppingList::create([
            'user_id' => $userId,
            'name' => $request->name,
            //'route_id' => $request->route_id,
        ]);

        Log::info("Created shopping list: " . $shoppingList);

        return response()->json($shoppingList, 201);
    }


    public function show(ShoppingList $shoppingList)
    {
        return response()->json($shoppingList, 200);
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

    public function destroy(ShoppingList $shoppingList)
    {
        $shoppingList->delete();
        return response()->json(null, 204);
    }
}

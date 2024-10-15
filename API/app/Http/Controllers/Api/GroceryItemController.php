<?php

// app/Http/Controllers/Api/GroceryItemController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroceryItem;
use App\Models\SharedShoppingListPerm;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class GroceryItemController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return response()->json(GroceryItem::all(), 200);
    }

    // Below are all CRUD operations

    public function store(Request $request)
    {

        try {
            $request->validate([
                'name' => 'required|string',
                'quantity' => 'required|integer',
                'is_food' => 'required|boolean',
                'shopping_list_id' => 'required|exists:shopping_lists,list_id',
            ]);

            Log::info("Validation passed for request: " . print_r($request->all(), true));

            // This is how we get the user_id of the resource for the grocery item 
            // (i.e. check its corresponding shopping list)
            $shoppingList = ShoppingList::findOrFail($request->shopping_list_id);
            // This will automatically call the `view` method in the ShoppingListPolicy
            $this->authorize('update', $shoppingList); // Throws a 403 if not authorized

            $groceryItem = GroceryItem::create($request->all());

            // Also update shopping list name "updated_at" field (users should know the shopping list has been
            // modified without having to see the individual items; this is done via this functionality and shown
            // for the Dashboard front end component list items)
            $shoppingList->updated_at = now(); // Update the timestamp
            $shoppingList->save();

            return response()->json($groceryItem, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation failed: " . $e->getMessage());
            Log::error("Validation errors: " . print_r($e->errors(), true));
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    // The $id is actually the id of the shopping list (it's a foreign key)
    public function show(Request $request, $id)
    {
        $groceryItems = GroceryItem::where('shopping_list_id', $id)->get();
        // This is how we get the user_id of the resource for the grocery item 
        // (i.e. check its corresponding shopping list)
        $shoppingList = ShoppingList::findOrFail($id);
        // This will automatically call the `view` method in the ShoppingListPolicy
        $this->authorize('view', $shoppingList); // Throws a 403 if not authorized
        
        return response()->json($groceryItems, 200);
    }

    public function update(Request $request, $id)
    {
        // Validate request
        $validatedData = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
            'is_food' => 'required|boolean',
        ]);
    
        // Find the grocery item by ID and update the fields
        $groceryItem = GroceryItem::findOrFail($id);
        Log::info("Found groceryItem: " . print_r($groceryItem, true));
        
        // This is how we get the user_id of the resource for the grocery item 
        // (i.e. check its corresponding shopping list)
        $shoppingList = ShoppingList::findOrFail($groceryItem->shopping_list_id);
        // This will automatically call the `view` method in the ShoppingListPolicy
        $this->authorize('update', $shoppingList); // Throws a 403 if not authorized
        
        $groceryItem->name = $validatedData['name'];
        $groceryItem->quantity = $validatedData['quantity'];
        $groceryItem->is_food = $validatedData['is_food'];
        $groceryItem->save();

        // Also update shopping list name "updated_at" field (users should know the shopping list has been
        // modified without having to see the individual items; this is done via this functionality and shown
        // for the Dashboard front end component list items)
        $shoppingList->updated_at = now(); // Update the timestamp
        $shoppingList->save();
    
        return response()->json($groceryItem, 200);
    }    

    public function destroy(Request $request, $id)
    {
        try {
            $groceryItem = GroceryItem::findOrFail($id);
            
            // This is how we get the user_id of the resource for the grocery item 
            // (i.e. check its corresponding shopping list)
            $shoppingList = ShoppingList::findOrFail($groceryItem->shopping_list_id);

            // I THINK WE MIGHT NEED TO TEST THIS (WHAT IF THEY DELETE THE SHOPPINGLIST??)
            // This will automatically call the `view` method in the ShoppingListPolicy
            $this->authorize('update', $shoppingList); // Throws a 403 if not authorized

            Log::info("Deleting item: " . print_r($groceryItem, true));
            $groceryItem->delete();

            // Also update shopping list name "updated_at" field (users should know the shopping list has been
            // modified without having to see the individual items; this is done via this functionality and shown
            // for the Dashboard front end component list items)
            $shoppingList->updated_at = now(); // Update the timestamp
            $shoppingList->save();

            return response()->json(['message' => 'Grocery item deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting grocery item: ' . $e->getMessage());
            return response()->json(['error' => 'Could not delete grocery item'], 500);
        }
    }
}

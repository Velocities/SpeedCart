<?php

// app/Http/Controllers/Api/GroceryItemController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroceryItem;
use Illuminate\Http\Request;

class GroceryItemController extends Controller
{
    public function index()
    {
        return response()->json(GroceryItem::all(), 200);
    }

    // Below are all CRUD operations

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
            'is_food' => 'required|boolean',
            'shopping_list_id' => 'required|exists:shopping_lists,list_id',
        ]);

        $groceryItem = GroceryItem::create($request->all());
        return response()->json($groceryItem, 201);
    }

    public function show(GroceryItem $groceryItem)
    {
        return response()->json($groceryItem, 200);
    }

    public function update(Request $request, GroceryItem $groceryItem)
    {
        $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
            'is_food' => 'required|boolean',
            'shopping_list_id' => 'required|exists:shopping_lists,list_id',
        ]);

        $groceryItem->update($request->all());
        return response()->json($groceryItem, 200);
    }

    public function destroy(GroceryItem $groceryItem)
    {
        $groceryItem->delete();
        return response()->json(null, 204);
    }
}

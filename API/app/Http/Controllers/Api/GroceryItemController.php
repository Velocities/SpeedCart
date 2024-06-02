<?php

// app/Http/Controllers/Api/GroceryItemController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GroceryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GroceryItemController extends Controller
{
    public function index()
    {
        return response()->json(GroceryItem::all(), 200);
    }

    // Below are all CRUD operations

    public function store(Request $request)
    {
        Log::info("Running store method now for GroceryItemController on " . print_r($request->all(), true));

        foreach ($request->all() as $key => $value) {
            Log::info("gettype($key) === " . gettype($value));
        }

        try {
            $request->validate([
                'name' => 'required|string',
                'quantity' => 'required|integer',
                'is_food' => 'required|boolean',
                'shopping_list_id' => 'required|exists:shopping_lists,list_id',
            ]);

            Log::info("Validation passed for request: " . print_r($request->all(), true));

            $groceryItem = GroceryItem::create($request->all());
            return response()->json($groceryItem, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation failed: " . $e->getMessage());
            Log::error("Validation errors: " . print_r($e->errors(), true));
            return response()->json(['error' => $e->errors()], 422);
        }
    }


    public function show($id)
    {
        $groceryItems = GroceryItem::where('shopping_list_id', $id)->get();
        return response()->json($groceryItems, 200);
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

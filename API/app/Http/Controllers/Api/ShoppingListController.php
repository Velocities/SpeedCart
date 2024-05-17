<?php

// app/Http/Controllers/Api/ShoppingListController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    public function index()
    {
        return response()->json(ShoppingList::all(), 200);
    }

    // Below are all CRUD operations
    
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,user_id',
            'name' => 'required|string',
            'route_id' => 'nullable|exists:routes,route_id',
        ]);

        $shoppingList = ShoppingList::create($request->all());
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

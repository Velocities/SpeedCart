<?php

// app/Http/Controllers/Api/RouteController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index()
    {
        return response()->json(Route::all(), 200);
    }

    // Below are all CRUD operations

    public function store(Request $request)
    {
        $request->validate([
            'polyline_data' => 'required|string',
        ]);

        $route = Route::create($request->all());
        return response()->json($route, 201);
    }

    public function show(Route $route)
    {
        return response()->json($route, 200);
    }

    public function update(Request $request, Route $route)
    {
        $request->validate([
            'polyline_data' => 'required|string',
        ]);

        $route->update($request->all());
        return response()->json($route, 200);
    }

    public function destroy(Route $route)
    {
        $route->delete();
        return response()->json(null, 204);
    }
}

<?php

// Note: We need to move almost all of this content to api.php for clarity ASAP

use App\Libraries\Database\Database;
use App\Libraries\Logging\Loggable;

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;

use App\Http\Middleware\GoogleAuthentication; // This brings in our middleware to ensure authentication prior to user actions actually being done

// This is primarily for testing; since it's middleware, it doesn't usually get directly contacted
Route::post('/auth/google', function () {
    // No code necessary here; we just want to test the middleware
    Log::error("Finished executing GoogleAuthentication middleware"); // Why isn't this logging?
    return response()->json([
        'status' => 'success',
        'message' => 'Authentication successful',
    ], 200);
})->middleware(GoogleAuthentication::class);


Route::get('/phpinfo', function () {
    phpinfo();
});

//use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\GroceryItemController;

//Route::apiResource('users', UserController::class);
Route::apiResource('routes', RouteController::class);

//Route::apiResource('shopping-lists', ShoppingListController::class);
// Middleware for authentication endpoint
Route::post('/shopping-lists', [ShoppingListController::class, 'store'])
->middleware(GoogleAuthentication::class);

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists', [ShoppingListController::class, 'getUserShoppingLists'])
->middleware(GoogleAuthentication::class);

// Route for retrieving shopping list title for a given ID
Route::get('/shopping-lists/{id}', [ShoppingListController::class, 'show'])
->middleware(GoogleAuthentication::class);

// Route for retrieving all items for a given shopping list ID
Route::get('/grocery-items/{id}', [GroceryItemController::class, 'show'])
->middleware(GoogleAuthentication::class);

// Route for deleting a shopping list
Route::delete('/shopping-lists/{id}', [ShoppingListController::class, 'destroy'])
    ->middleware(GoogleAuthentication::class);

Route::post('grocery-items', [GroceryItemController::class, 'store'])
    ->middleware(GoogleAuthentication::class);
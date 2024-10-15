<?php

// Note: We need to move almost all of this content to api.php for clarity ASAP

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GoogleAuthenticationController;
use App\Http\Controllers\ListPermissionsController;

// Cookie handling endpoints for login sessions
Route::post('/auth/google', [GoogleAuthenticationController::class, 'handleLogin']);
Route::delete('/auth/google', [GoogleAuthenticationController::class, 'handleLogout'])
->middleware('auth:sanctum'); // Necessary to grab the user


Route::get('/phpinfo', function () {
    phpinfo();
});

//use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\GroceryItemController;

Route::apiResource('routes', RouteController::class);

Route::post('/shopping-lists', [ShoppingListController::class, 'store'])
->middleware('auth:sanctum');

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists', [ShoppingListController::class, 'getUserShoppingLists'])
->middleware('auth:sanctum');

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists/shared', [ShoppingListController::class, 'getSharedShoppingLists'])
->middleware('auth:sanctum');

// Route for retrieving shopping list title for a given ID
Route::get('/shopping-lists/{id}', [ShoppingListController::class, 'show'])
->middleware('auth:sanctum');

// Route for retrieving all items for a given shopping list ID
Route::get('/grocery-items/{id}', [GroceryItemController::class, 'show'])
->middleware('auth:sanctum');

// Route for deleting a shopping list
Route::delete('/shopping-lists/{id}', [ShoppingListController::class, 'destroy'])
->middleware('auth:sanctum');

// Sharing feature routes
// This should create a share link and return it to the user
Route::post('/share/{token}', [ListPermissionsController::class, 'share'])
->middleware('auth:sanctum');

// This should accept a share link and set the proper permissions for the user
Route::get('/share/{token}', [ListPermissionsController::class, 'verifyShare'])
->middleware('auth:sanctum');
// End of sharing feature routes

Route::post('grocery-items', [GroceryItemController::class, 'store'])
->middleware('auth:sanctum');

// Route for updating shopping list title
Route::put('/shopping-lists/{id}', [ShoppingListController::class, 'update'])
->middleware('auth:sanctum');

// Route for updating grocery items
Route::put('/grocery-items/{id}', [GroceryItemController::class, 'update'])
->middleware('auth:sanctum');

// This is also needed for "updating" a grocery list because some items could be deleted
Route::delete('/grocery-items/{id}', [GroceryItemController::class, 'destroy'])
->middleware('auth:sanctum');

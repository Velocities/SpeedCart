<?php

// Note: We need to move almost all of this content to api.php for clarity ASAP

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Route;

use App\Http\Middleware\GoogleAuthentication; // This brings in our middleware to ensure authentication prior to user actions actually being done

use App\Http\Controllers\GoogleAuthCookieController;

// Cookie handling endpoints for login sessions
Route::post('/auth/google', [GoogleAuthentication::class, 'handle']);
Route::delete('/auth/google', [GoogleAuthCookieController::class, 'removeCookie']);
//Route::delete('/logout', [GoogleAuthCookieController::class, 'removeCookie']);


Route::post('/login', [GoogleAuthentication::class, 'handle']);
Route::get('/phpinfo', function () {
    phpinfo();
});

//use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\GroceryItemController;

//Route::apiResource('users', UserController::class);
Route::apiResource('routes', RouteController::class);

Route::post('/shopping-lists', [ShoppingListController::class, 'store'])
->middleware(GoogleAuthentication::class);

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists', [ShoppingListController::class, 'getUserShoppingLists'])
->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    Log::info("SANCTUM USER: ".$request->user());
    return $request->user();
})->middleware('auth:sanctum');

// Route for retrieving all shopping list titles (used for Dashboard page)
Route::get('/shopping-lists/shared', [ShoppingListController::class, 'getSharedShoppingLists'])
->middleware('auth:sanctum');

// Route for retrieving shopping list title for a given ID
Route::get('/shopping-lists/{id}', [ShoppingListController::class, 'show'])
->middleware(GoogleAuthentication::class);

// Route for retrieving all items for a given shopping list ID
Route::get('/grocery-items/{id}', [GroceryItemController::class, 'show'])
->middleware(GoogleAuthentication::class);

// Route for deleting a shopping list
Route::delete('/shopping-lists/{id}', [ShoppingListController::class, 'destroy'])
    ->middleware(GoogleAuthentication::class);

// Sharing feature routes
// This should create a share link and return it to the user
Route::post('/share/{token}', [ShoppingListController::class, 'share'])
    ->middleware(GoogleAuthentication::class);

// This should accept a share link and set the proper permissions for the user
Route::get('/share/{token}', [ShoppingListController::class, 'verifyShare'])
    ->middleware(GoogleAuthentication::class);
// End of sharing feature routes

Route::post('grocery-items', [GroceryItemController::class, 'store'])
    ->middleware(GoogleAuthentication::class);

// Route for updating shopping list title
Route::put('/shopping-lists/{id}', [ShoppingListController::class, 'update'])
    ->middleware(GoogleAuthentication::class);

// Route for updating grocery items
Route::put('/grocery-items/{id}', [GroceryItemController::class, 'update'])
    ->middleware(GoogleAuthentication::class);

// This is also needed for "updating" a grocery list because some items could be deleted
Route::delete('/grocery-items/{id}', [GroceryItemController::class, 'destroy'])
    ->middleware(GoogleAuthentication::class);

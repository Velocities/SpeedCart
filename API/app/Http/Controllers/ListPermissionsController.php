<?php
namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

use App\Models\SharedShoppingListPerm;
use App\Models\SharedLink;
use App\Models\ShoppingList;

use Illuminate\Http\Request;  // Necessary to enforce Sanctum Middleware in constructor code
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ListPermissionsController extends BaseController
{

    // This constructor enforces the middleware for identifying a user via Laravel Sanctum
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }


    //
    public function share($id, Request $request)
    {
        $shoppingList = ShoppingList::findOrFail($id);
        Log::info("Shopping list id: " . $shoppingList->list_id . " and we started with id: " . $id);
        //Log::info("shoppingList object: " . print_r($shoppingList, true));

        $maxRetries = 10; // Maximum number of retries
        $retryCount = 0;

        do {
            $token = (string) Str::uuid();
            $exists = SharedLink::where('token', $token)->exists();
            $retryCount++;
        } while ($exists && $retryCount < $maxRetries);

        if ($exists) {
            // If a unique token could not be generated, handle the error
            return response()->json(['error' => 'Unable to generate a unique link. Please try again later.'], 500);
        }

        // Extract permissions from request
        $canUpdate = $request->can_update ?? false;
        $canDelete = $request->can_delete ?? false;

        Log::info("canUpdate: " . $canUpdate);
        Log::info("canDelete: " . $canDelete);


        // Store the link with the shopping list ID and permissions
        SharedLink::create([
            'shopping_list_id' => $shoppingList->list_id,
            'token' => $token,
            'expires_at' => now()->addDays(7), // Optional: set expiration date
            'can_update' => $canUpdate,
            'can_delete' => $canDelete,
        ]);

        // Create the full URL with the domain
        $url = "https://www.speedcartapp.com/share/$token";

        return response()->json(['link' => $url]);
    }

    public function verifyShare($token, Request $request)
    {
        Log::info("Received shopping-lists request from IP address " . $request->ip());

        // Grab user from sanctum
        $user = Auth::user();

        // Retrieve the shared link
        $sharedLink = SharedLink::where('token', $token)->first();

        // Check if the link exists
        if (!$sharedLink) {
            abort(404, 'Link not found');
        }
        Log::info("LINK WAS FOUND!");

        // Check if the link is expired
        if (now()->greaterThan($sharedLink->expires_at)) {
            Log::info("Link has expired");
            // Remove the expired link from the database
            SharedLink::where('token', $token)->delete();
            abort(403, 'Link expired');
        }

        Log::info("Retrieving shopping list with id " . $sharedLink->shopping_list_id);

        // Retrieve the shopping list
        $shoppingList = ShoppingList::findOrFail($sharedLink->shopping_list_id);

        Log::info("Got shopping list!");

        // Here, you may want to update the permissions for the user or perform any other actions
        // For instance, you might want to set permissions for the user, if applicable.
        $currentUserId = $user->user_id; // Assuming the user is authenticated

        if ($currentUserId) {
            Log::info("Setting user permissions for user: " . $currentUserId);
            // Create or update the permission record
            SharedShoppingListPerm::updateOrCreate(
                ['shopping_list_id' => $shoppingList->list_id, 'user_id' => $currentUserId],
                [
                    'shopping_list_id' => $shoppingList->list_id,
                    'user_id' => $currentUserId,
                    'can_update' => $sharedLink->can_update,
                    'can_delete' => $sharedLink->can_delete,
                ]
            );
        }
        // Remove the used link from the database
        SharedLink::where('token', $token)->delete();

        // Retrieve the shopping list
        $shoppingList = ShoppingList::findOrFail($sharedLink->shopping_list_id);

        return response()->json($shoppingList, 201);
    }

}

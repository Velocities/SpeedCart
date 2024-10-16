<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ShoppingList;
use App\Models\SharedShoppingListPerm;

class ShoppingListPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, ShoppingList $shoppingList)
    {
        // Check if the user owns the list or has it shared with them (read permissions is implied if an entry is present; reading is the bare minimum)
        return $shoppingList->user_id === $user->user_id || 
            SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)
            ->where('user_id', $user->user_id)
            ->exists(); // Check if any entry exists
    }

    public function update(User $user, ShoppingList $shoppingList)
    {
        $sharedPermissionEntry = SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)
            ->where('user_id', $user->user_id)
            ->first(); // Retrieves the first matching entry or null if none found
        
        $sharedCanUpdate = false;
        if ($sharedPermissionEntry) {
            if ($sharedPermissionEntry->can_update) {
                $sharedCanUpdate = true;
            }
        }

        // Check if the user owns the list or has 'can_update' permission in sharedWithUsers
        return $shoppingList->user_id === $user->user_id ||
               $sharedCanUpdate;
    }

    public function delete(User $user, ShoppingList $shoppingList)
    {
        $sharedPermissionEntry = SharedShoppingListPerm::where('shopping_list_id', $shoppingList->list_id)
            ->where('user_id', $user->user_id)
            ->first(); // Retrieves the first matching entry or null if none found
        
        $sharedCanDelete = false;
        if ($sharedPermissionEntry) {
            if ($sharedPermissionEntry->can_delete) {
                $sharedCanDelete = true;
            }
        }
        // Check if the user owns the list or has 'can_delete' permission in sharedWithUsers
        return $shoppingList->user_id === $user->user_id ||
               $sharedCanDelete;
    }
}


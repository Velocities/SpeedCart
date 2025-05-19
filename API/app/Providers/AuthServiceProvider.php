<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\ShoppingList;
use App\Models\GroceryItem;
use App\Policies\ShoppingListPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        ShoppingList::class => ShoppingListPolicy::class,
        GroceryItem::class => ShoppingListPolicy::class,
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
        $this->registerPolicies();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
        $this->register();
        // You can define gates here if needed

    }
}

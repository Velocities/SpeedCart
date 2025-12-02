<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Necessary for testing app locally
        //check that app is local
        if ($this->app->isLocal()) {
            //if local register your services you require for development
            $this->app->register('Barryvdh\Debugbar\ServiceProvider');
        } else {
            //else register your services you require for production
            $this->app['request']->server->set('HTTPS', true);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        if (!defined('DEBUG_MODE')) {
            define('DEBUG_MODE', env('DEBUG_MODE', false));
        }
        if (!defined('GOOGLE_CLIENT_ID')) {
            // Fetch the client ID from the environment variable
            define('GOOGLE_CLIENT_ID', env('GOOGLE_CLIENT_ID'));
        }
    }
}

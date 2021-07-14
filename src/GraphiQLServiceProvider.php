<?php

namespace Malico\GraphiQL;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class GraphiQLServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../config/graphiql.php' => $this->app->configPath() . '/graphiql.php',
        ], 'graphiql-config');

        $this->publishes([
            __DIR__ . '/../dist' => public_path('vendor/graphiql'),
        ], 'graphiql-assets');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'graphiql');

        if (config('graphiql.enabled_in_production') || $this->app->isLocal()) {
            $this->setupRoutes();
        }
    }

    public function setupRoutes()
    {
        Route::group([
            'domain'    => config('graphiql.route.prefix'),
            'prefix'    => config('graphiql.route.prefix'),
            'middlware' => config('graphiql.route.middleware'),
        ], function () {
            Route::view(config('graphiql.route.uri'), 'graphiql::graphiql')->name(config('graphiql.route.name'));
        });
    }

    public function register()
    {
        $this->mergeConfigFrom(
                __DIR__ . '/../config/graphiql.php',
                'graphiql'
            );
    }
}

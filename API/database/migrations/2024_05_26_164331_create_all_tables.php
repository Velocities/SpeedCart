<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllTables extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create users table
        Schema::create('users', function (Blueprint $table) {
            $table->string('user_id')->primary();
            $table->string('username')->notNullable();
            // Add other user-related fields as needed
            $table->timestamps();
        });

        // Create routes table
        Schema::create('routes', function (Blueprint $table) {
            $table->increments('route_id');
            $table->text('polyline_data')->nullable();
            $table->timestamps();
        });

        // Create shopping_lists table
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->increments('list_id');
            $table->string('user_id')->notNullable();
            $table->string('name')->notNullable();
            $table->integer('route_id')->unsigned()->nullable();
            // Foreign keys
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->foreign('route_id')->references('route_id')->on('routes');
            $table->timestamps();
        });

        // Create grocery_items table
        Schema::create('grocery_items', function (Blueprint $table) {
            $table->increments('item_id');
            $table->string('name')->notNullable();
            $table->integer('quantity')->nullable();
            $table->boolean('is_food')->default(false);
            $table->integer('shopping_list_id')->unsigned();
            $table->foreign('shopping_list_id')->references('list_id')->on('shopping_lists');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grocery_items');
        Schema::dropIfExists('shopping_lists');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('users');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->id('list_id'); // Auto-incrementing primary key
            $table->uuid('user_id'); // User ID, manually set by the application
            $table->string('name'); // Name, not nullable
            $table->uuid('route_id')->default(DB::raw('(UUID())')); // Route ID, default to a UUID

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('route_id')->references('id')->on('routes')->onDelete('set null');

            $table->timestamps(); // Timestamps for created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('shopping_lists');
    }
};

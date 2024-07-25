<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shared_links', function (Blueprint $table) {
            $table->id();
            $table->string('token')->notNullable();
            $table->date('expires_at')->notNullable();
            $table->timestamps();

            // We need these boolean fields here temporarily
            // Boolean field for update permission
            $table->boolean('can_update')->default(false);
            
            // Boolean field for delete permission
            $table->boolean('can_delete')->default(false);

            // Ensure the foreign key column allows null values
            $table->unsignedBigInteger('shopping_list_id')->notNullable();
            
            // Set the foreign key constraint with onDelete behavior
            $table->foreign('shopping_list_id')
                  ->references('list_id')
                  ->on('shopping_lists')
                  ->onDelete('cascade');
        });

        Schema::create('shared_shopping_list_perms', function (Blueprint $table) {
            $table->id();

            // ID foreign key to relate to Users who are granted the specified access
            $table->string('user_id')->notNullable();
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade'); // If the user is deleted, obviously any entries in this table for that should be deleted

            // Boolean field for update permission
            $table->boolean('can_update')->default(false);
            
            // Boolean field for delete permission
            $table->boolean('can_delete')->default(false);

            $table->date('expires_at')->nullable(); // Maybe someone is only granted temporary access
            $table->timestamps();
            
            // ID foreign key to relate to Shopping Lists
            $table->integer('shopping_list_id')->unsigned()->notNullable();
            $table->foreign('shopping_list_id')
                ->references('list_id')
                ->on('shopping_lists')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_links');
        Schema::dropIfExists('shared_shopping_list_perms');
    }
};

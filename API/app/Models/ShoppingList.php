<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShoppingListsTable extends Migration
{
    public function up()
    {
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->id('list_id');
            $table->uuid('user_id');
            $table->string('name');
            $table->foreignId('route_id')->nullable()->constrained('routes');
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shopping_lists');
    }
}

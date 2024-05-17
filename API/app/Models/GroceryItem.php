<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroceryItemsTable extends Migration
{
    public function up()
    {
        Schema::create('grocery_items', function (Blueprint $table) {
            $table->id('item_id');
            $table->string('name');
            $table->integer('quantity')->default(1);
            $table->boolean('is_food');
            $table->foreignId('shopping_list_id')->constrained('shopping_lists');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('grocery_items');
    }
}

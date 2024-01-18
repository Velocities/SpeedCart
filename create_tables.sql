-- create_tables.sql

-- Create a database
CREATE DATABASE IF NOT EXISTS grocery_app;

-- Switch to the newly created database
USE grocery_app;

-- Create a table for grocery items
CREATE TABLE IF NOT EXISTS grocery_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT,
    is_food BOOLEAN NOT NULL,
    shopping_list_id INT,
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (list_id)
);

-- Create a table for shopping lists
CREATE TABLE IF NOT EXISTS shopping_lists (
    list_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    route_id INT,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (route_id) REFERENCES routes (route_id)
);

-- Create a table for routes
CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    polyline_data TEXT
);

-- Create a table for users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    -- Add other user-related fields as needed
);

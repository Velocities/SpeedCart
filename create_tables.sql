-- Create a table for users
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL
    -- Add other user-related fields as needed
);

-- Create a table for routes
CREATE TABLE IF NOT EXISTS routes (
    route_id INTEGER PRIMARY KEY AUTOINCREMENT,
    polyline_data TEXT
);

-- Create a table for shopping lists
CREATE TABLE IF NOT EXISTS shopping_lists (
    list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    route_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (route_id) REFERENCES routes (route_id)
);

-- Create a table for grocery items
CREATE TABLE IF NOT EXISTS grocery_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER,
    is_food BOOLEAN NOT NULL,
    shopping_list_id INTEGER,
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (list_id)
);

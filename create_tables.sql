-- create_tables.sql

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    google_user_id TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT
);

CREATE TABLE shopping_lists (
    list_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    list_name TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE grocery_items (
    item_id INTEGER PRIMARY KEY,
    list_id INTEGER,
    item_name TEXT,
    price REAL,
    FOREIGN KEY (list_id) REFERENCES shopping_lists(list_id)
);

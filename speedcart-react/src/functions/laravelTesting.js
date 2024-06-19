import axios from 'axios';

const API_BASE_URL = 'https://api.speedcartapp.com';

// Create a new user
async function createUser(userId, username) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, {
            user_id: userId,
            username: username
        });
        console.log('User Created:', response.data);
    } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
}

// Get all users
async function getAllUsers() {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        console.log('All Users:', response.data);
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
}

// Create a new route
async function createRoute(polylineData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/routes`, {
            polyline_data: polylineData
        });
        console.log('Route Created:', response.data);
    } catch (error) {
        console.error('Error creating route:', error.response ? error.response.data : error.message);
    }
}

// Create a new shopping list
async function createShoppingList(userId, name, routeId) {
    try {
        const response = await axios.post(`${API_BASE_URL}/shopping-lists`, {
            user_id: userId,
            name: name,
            route_id: routeId
        });
        console.log('Shopping List Created:', response.data);
    } catch (error) {
        console.error('Error creating shopping list:', error.response ? error.response.data : error.message);
    }
}

// Create a new grocery item
async function createGroceryItem(name, quantity, isFood, shoppingListId) {
    try {
        const response = await axios.post(`${API_BASE_URL}/grocery-items`, {
            name: name,
            quantity: quantity,
            is_food: isFood,
            shopping_list_id: shoppingListId
        });
        console.log('Grocery Item Created:', response.data);
    } catch (error) {
        console.error('Error creating grocery item:', error.response ? error.response.data : error.message);
    }
}

// Example usage
(async () => {
    await createUser('some-uuid', 'john_doe');
    //await getAllUsers();
    //await createRoute('some_polyline_data');
    //await createShoppingList('some-uuid', 'Weekly Groceries', 1);
    //await createGroceryItem('Apples', 5, true, 1);
})();

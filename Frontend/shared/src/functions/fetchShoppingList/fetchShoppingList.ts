import { BASE_URL, TESTING_MODE } from '@constants';

export const fetchShoppingList = async (authToken = '', listId: string) => {
    const url = `${BASE_URL}/shopping-lists/${listId}`;
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (TESTING_MODE && authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch shopping list with ID ${listId}`);
    }

    // Return JSON response
    return response.json();
};
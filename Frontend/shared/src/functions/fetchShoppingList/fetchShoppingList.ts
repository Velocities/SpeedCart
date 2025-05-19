import { BASE_URL, TESTING_MODE } from '@constants';
import { BackendFunction } from "@types";

export const fetchShoppingList: BackendFunction<
  {listId: string},
  Response
> = async (authToken = '', {listId}) => {
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
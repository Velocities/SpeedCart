import { BASE_URL, TESTING_MODE } from '@constants';

export const deleteShoppingList = async (authToken = '', listId: string) => {
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (TESTING_MODE && authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return fetch(`${BASE_URL}/shopping-lists/${listId}`, {
        method: 'DELETE',
        headers: headers,
        credentials: 'include' // Include cookies in the request
    })
};
import { BASE_URL } from '@constants';

export const deleteShoppingList = async (listId: string) => {
    return fetch(`${BASE_URL}/shopping-lists/${listId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies in the request
    })
};
import { BASE_URL } from '@constants/config';

export const updateShoppingListTitle = async (shoppingListName, shoppingListId) => {
    return fetch(`${BASE_URL}/shopping-lists/${shoppingListId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: shoppingListName })
    });
}
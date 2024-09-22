import { BASE_URL } from '@constants';

export const updateShoppingListTitle = async (shoppingListName: string, shoppingListId: string) => {
    return fetch(`${BASE_URL}/shopping-lists/${shoppingListId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: shoppingListName })
    });
}
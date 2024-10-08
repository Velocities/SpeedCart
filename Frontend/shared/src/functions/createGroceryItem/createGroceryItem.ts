import { BASE_URL } from '@constants';
import { GroceryItem } from '@types';

export const createGroceryItem = async (item: GroceryItem) => {
    return fetch(`${BASE_URL}/grocery-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item)
    });
};
import { BASE_URL } from '@constants';
import { GroceryItem } from '@types';

export const updateGroceryItem = async (item: GroceryItem) => {
  return fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item)
  });
}
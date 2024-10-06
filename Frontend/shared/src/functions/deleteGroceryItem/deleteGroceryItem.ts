import { BASE_URL } from '@constants';
import { GroceryItem } from '@types';

export const deleteGroceryItem = async (item: GroceryItem) => {
    fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}
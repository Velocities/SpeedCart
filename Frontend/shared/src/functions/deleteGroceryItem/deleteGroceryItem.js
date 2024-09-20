import { BASE_URL } from '@constants/config';

export const deleteGroceryItem = async (item) => {
    fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}
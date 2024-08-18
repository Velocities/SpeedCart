import { BASE_URL } from '@constants/config';

export const updateGroceryItem = async (item) => {
  return fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item)
  });
}
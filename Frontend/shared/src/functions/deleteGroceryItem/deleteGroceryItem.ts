import { BASE_URL, TESTING_MODE } from '@constants';
import { GroceryItem } from '@types';

export const deleteGroceryItem = async (authToken = '', item: GroceryItem) => {
  const headers: any = {
      'Content-Type': 'application/json',
      "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }

  fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
      method: 'DELETE',
      headers: headers,
      credentials: 'include',
  });
}
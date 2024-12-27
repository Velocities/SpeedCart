import { BASE_URL, TESTING_MODE } from '@constants';
import { GroceryItem } from '@types';

export const updateGroceryItem = async (authToken = '', item: GroceryItem) => {
  const headers: any = {
      'Content-Type': 'application/json',
      "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(item)
  });
}
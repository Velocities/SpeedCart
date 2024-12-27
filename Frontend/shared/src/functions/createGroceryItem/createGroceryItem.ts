import { BASE_URL, TESTING_MODE } from '@constants';
import { GroceryItem } from '@types';

export const createGroceryItem = async (authToken = '', item: GroceryItem) => {
  const headers: any = {
    'Content-Type': 'application/json',
    "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${BASE_URL}/grocery-items`, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(item)
  });
};
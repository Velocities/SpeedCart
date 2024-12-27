import { BASE_URL, TESTING_MODE } from '@constants';

export const fetchGroceryItems = async (authToken = '', listId: string) => {
  const headers: any = {
      'Content-Type': 'application/json',
      "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${BASE_URL}/grocery-items/${listId}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });
};

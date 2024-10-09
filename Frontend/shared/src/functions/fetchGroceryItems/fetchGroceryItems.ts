import { BASE_URL } from '@constants';

export const fetchGroceryItems = async (listId: string) => {

  return fetch(`${BASE_URL}/grocery-items/${listId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

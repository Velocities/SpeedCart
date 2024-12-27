import { BASE_URL, TESTING_MODE } from '@constants';

export const updateShoppingListTitle = async (authToken = '', shoppingListName: string, shoppingListId: string) => {
  const headers: any = {
    'Content-Type': 'application/json',
    "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }
  return fetch(`${BASE_URL}/shopping-lists/${shoppingListId}`, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify({ name: shoppingListName })
  });
}
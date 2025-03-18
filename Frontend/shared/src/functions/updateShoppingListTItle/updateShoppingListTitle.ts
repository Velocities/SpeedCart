import { BASE_URL, TESTING_MODE } from '@constants';
import { BackendFunction } from "@types";

export const updateShoppingListTitle: BackendFunction<
  {shoppingListName: string, shoppingListId: string},
  Response
> = async (authToken = '', {shoppingListName, shoppingListId}) => {
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
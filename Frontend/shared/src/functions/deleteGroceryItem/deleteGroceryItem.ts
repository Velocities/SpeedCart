import { BASE_URL, TESTING_MODE } from '@constants';
import { GroceryItem } from '@types';
import { BackendFunction } from "@types";

export const deleteGroceryItem: BackendFunction<
    {item: GroceryItem},
    Response
> = async (authToken = '', {item}) => {
  const headers: any = {
      'Content-Type': 'application/json',
      "Accept" : "application/json"
  };

  if (TESTING_MODE && authToken !== '') {
      headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${BASE_URL}/grocery-items/${item.item_id}`, {
      method: 'DELETE',
      headers: headers,
      credentials: 'include',
  });
}
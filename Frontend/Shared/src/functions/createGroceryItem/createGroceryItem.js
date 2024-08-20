import { BASE_URL } from '@constants/config';
/*
This is what item must look like: 
{
  id: number;
  name: string;
  is_food: boolean;
  quantity: number;
  list_id: uuid (or Number, one of these?)
}
*/
export const createGroceryItem = async (item) => {
    return fetch(`${BASE_URL}/grocery-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item)
    });
};
import { BASE_URL } from '@constants';
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
export const deleteShoppingList = async (listId: string) => {
    return fetch(`${BASE_URL}/shopping-lists/${listId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies in the request
    })
};
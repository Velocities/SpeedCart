import { BASE_URL } from '@constants';

export const createShoppingList = async (name: string, routeId: any = null) => {
    return fetch(`${BASE_URL}/shopping-lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        route_id: routeId
      })
    });
};
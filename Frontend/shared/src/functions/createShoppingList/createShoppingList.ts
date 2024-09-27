import { BASE_URL } from '@constants';

export const createShoppingList = async (name: string, routeId: any = null) => {
    const url = `${BASE_URL}/shopping-lists`;

    const body = JSON.stringify({
      name: name,
      route_id: routeId
    });
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
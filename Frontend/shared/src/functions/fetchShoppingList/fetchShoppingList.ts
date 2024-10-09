import { BASE_URL } from '@constants';

export const fetchShoppingList = async (listId: string) => {
  const url = `${BASE_URL}/shopping-lists/${listId}`;

  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          // Add any authorization headers if needed
      },
      credentials: "include"
  });

  if (!response.ok) {
      throw new Error(`Failed to fetch shopping list with ID ${listId}`);
  }

  // Return JSON response
  return response.json();
};
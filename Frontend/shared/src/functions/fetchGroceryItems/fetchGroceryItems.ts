import { BASE_URL } from '@constants';

// Define the structure of a grocery item
export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  // Add other fields as needed
}

// Define the expected response structure
interface GroceryItemsResponse {
  items: GroceryItem[];
  total: number;
  // Add any additional fields returned by the API
}

export const fetchGroceryItems = async (listId: string): Promise<GroceryItem[]> => {
  const url = `${BASE_URL}/grocery-items/${listId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch grocery items for shopping list with ID ${listId}`);
  }

  return response.json() as Promise<GroceryItem[]>;
};

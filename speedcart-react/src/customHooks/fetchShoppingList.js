// api.js

const BASE_URL = 'https://api.speedcartapp.com';

const fetchShoppingList = async (listId) => {
  const url = `${BASE_URL}/shopping-lists/${listId}`;

  const authToken = localStorage.getItem('authToken');
      
  if (!authToken) {
      // Add some error handling
      return;
  }

  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
          // Add any authorization headers if needed
      },
  });

  if (!response.ok) {
      throw new Error(`Failed to fetch shopping list with ID ${listId}`);
  }

  // Clone the response before reading it as text
  const clonedResponse = response.clone();
  // Log the response body as text
  console.log('fetchShoppingList response:', await clonedResponse.text());

  // Return JSON response
  return response.json();
};

export default fetchShoppingList;

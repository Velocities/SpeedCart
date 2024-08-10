const BASE_URL = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

const fetchShoppingList = async (listId) => {
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

  // Clone the response before reading it as text
  //const clonedResponse = response.clone();
  // Log the response body as text (debugging use only)
  //console.log('fetchShoppingList response:', await clonedResponse.text());

  // Return JSON response
  return response.json();
};

export default fetchShoppingList;

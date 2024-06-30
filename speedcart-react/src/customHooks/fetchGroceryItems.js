const BASE_URL = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

const fetchGroceryItems = async (listId) => {
  const url = `${BASE_URL}/grocery-items/${listId}`;
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
    throw new Error(`Failed to fetch grocery items for shopping list with ID ${listId}`);
  }

  // Clone the response before reading it as text
  //const clonedResponse = response.clone();
  // Log the response body as text (debugging use only)
  //console.log('fetchGroceryItems response:', await clonedResponse.text());

  // Return JSON response
  return response.json();
};

export default fetchGroceryItems;

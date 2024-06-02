// ShoppingListDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchGroceryItems from '../../customHooks/fetchGroceryItems.js';
import fetchShoppingList from '../../customHooks/fetchShoppingList.js';

const ShoppingListDetail = () => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shopping list details
        const listData = await fetchShoppingList(id);
        setShoppingList(listData);

        // Fetch grocery items for the shopping list
        const itemsData = await fetchGroceryItems(id);
        setGroceryItems(itemsData);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    // Clean-up function if needed
    return () => {};
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping List: {shoppingList.name}</h2>
      <h3>Grocery Items:</h3>
      <ul>
        {groceryItems.map((item) => (
          <li key={item.item_id}>
            {item.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListDetail;

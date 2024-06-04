import React, { useState } from 'react';
import './NewShoppingList.css'; // Create this CSS file for styling
import layoutStyles from '../main.module.css'; // Import the new layout styles
// Custom component imports
import IntegerQuantityValue from '../../components/IntegerQuantityValue';

// Enum for form submission state
const SaveState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const NewShoppingList = () => {
  const [items, setItems] = useState([{ name: '', is_food: false, quantity: 0 }]);
  const [listTitle, setListTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState(SaveState.IDLE);

  const handleListTitleChange = (newValue) => {
    setListTitle(newValue);
  };

  const handleInputChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    setItems(newItems);
    console.log(`Updated items: ${JSON.stringify(newItems)}`); // Debug log
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', is_food: false, quantity: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleQuantityChange = (index, value) => {
    handleInputChange(index, 'quantity', value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveStatus(SaveState.LOADING);

    try {
      const token = localStorage.getItem('authToken');

      const shoppingList = await createShoppingList(token, listTitle); // Create the shopping list
      console.log('Created shopping list:', shoppingList);

      // Save each item to the created shopping list
      for (let item of items) {
        await createGroceryItem(token, { ...item, shopping_list_id: shoppingList.list_id });
      }

      setSaveStatus(SaveState.SUCCESS);
    } catch (error) {
      console.error('Error creating shopping list or items:', error);
      setSaveStatus(SaveState.ERROR);
    }
  };

  const createShoppingList = async (token, name, routeId = null) => {
    const url = 'https://api.speedcartapp.com/shopping-lists';
  
    const body = JSON.stringify({
      name: name,
      route_id: routeId
    });
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };

  const createGroceryItem = async (token, item) => {
    const url = 'https://api.speedcartapp.com/grocery-items';

    console.log(`Sending item: ${JSON.stringify(item)}`); // Debug log

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return (
    <form className={`shopping-list ${layoutStyles.fullHeightContainer}`} onSubmit={handleSubmit}>
      <label htmlFor="listTitle">Title of new list:</label>
      <input type="text" name="listTitle" value={listTitle} onChange={(e) => handleListTitleChange(e.target.value)} required />
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
          />
          <IntegerQuantityValue value={item.quantity} onChange={(value) => handleQuantityChange(index, value)} />
          <input
            type="checkbox"
            checked={item.is_food}
            onChange={(e) => handleInputChange(index, 'is_food', e.target.checked)}
          />
          <button type="button" className="trash-bin" onClick={() => handleRemoveItem(index)}>
            🗑️
          </button>
        </div>
      ))}
      <button type="button" className="add-item" onClick={handleAddItem}>
        Add Item
      </button>
      <button type="submit" className="save-list">
        Save List
      </button>
      {saveStatus === SaveState.LOADING && <div>Loading...</div>}
      {saveStatus === SaveState.SUCCESS && <div>Save successful ✅</div>}
      {saveStatus === SaveState.ERROR && <div>Save failed ❌</div>}
    </form>
  );
};

export default NewShoppingList;

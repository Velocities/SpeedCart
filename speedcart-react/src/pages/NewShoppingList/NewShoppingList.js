import React, { useState, useEffect } from 'react';
import styles from './NewShoppingList.module.css';
import inputStyles from '../../modularStyles/inputs.module.css';
import layoutStyles from '../main.module.css';
import ShoppingListItem from '../../components/ShoppingListItem';

const SaveState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const NewShoppingList = () => {
  const [items, setItems] = useState([{ id: Date.now(), name: '', is_food: false, quantity: 1 }]);
  const [listTitle, setListTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState(SaveState.IDLE);

  useEffect(() => {
    document.title = "Create new shopping list";
  }, []);

  const handleListTitleChange = (newValue) => {
    setListTitle(newValue);
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', is_food: false, quantity: 1 }]);
  };

  const handleItemChange = (index, newItem) => {
    const newItems = [...items];
    newItems[index] = newItem;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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
    const url = 'https://api.speedcartapp.com:8443/shopping-lists';

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
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const createGroceryItem = async (token, item) => {
    const url = 'https://api.speedcartapp.com:8443/grocery-items';

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
    <form className={`${styles.shoppingList} ${layoutStyles.fullHeightContainer}`} onSubmit={handleSubmit}>
      <label htmlFor="listTitle">Title of new list:</label>
      <input className={inputStyles.input} type="text" name="listTitle" value={listTitle} onChange={(e) => handleListTitleChange(e.target.value)} required />
      {items.map((item, index) => (
        <ShoppingListItem
          key={item.id}
          item={item}
          index={index}
          onItemChange={handleItemChange}
          onRemoveItem={handleRemoveItem}
          isEditing={true}
        />
      ))}
      <button type="button" className={`${styles.addItem} ${inputStyles.smallButton}`} onClick={handleAddItem}>
        Add Item
      </button>
      <button type="submit" className={inputStyles.smallButton}>
        Save List
      </button>
      {saveStatus === SaveState.LOADING && <div>Loading...</div>}
      {saveStatus === SaveState.SUCCESS && <div>Save successful ✅</div>}
      {saveStatus === SaveState.ERROR && <div>Save failed ❌</div>}
    </form>
  );
};

export default NewShoppingList;

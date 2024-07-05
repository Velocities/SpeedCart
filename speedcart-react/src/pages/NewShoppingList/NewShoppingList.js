import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import styles from './NewShoppingList.module.css';
import inputStyles from '@modularStyles/inputs.module.css';
import ShoppingListItem from '@components/ShoppingListItem';

const SaveState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

const NewShoppingList = () => {
  const navigate = useNavigate();
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

      // Save each item to the created shopping list
      for (let item of items) {
        await createGroceryItem(token, { ...item, shopping_list_id: shoppingList.list_id });
      }

      setSaveStatus(SaveState.SUCCESS);
      // This needs to have a small delay so the user can know they're being redirected
      setTimeout(() => {
        navigate(`/shopping-list/${shoppingList.list_id}`);
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error creating shopping list or items:', error);
      setSaveStatus(SaveState.ERROR);
    }
  };

  const createShoppingList = async (token, name, routeId = null) => {
    const url = `${baseUrl}/shopping-lists`;

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
    const url = `${baseUrl}/grocery-items`;

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
    <form className={`${styles.shoppingList} main-content`} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="listTitle">Title of new list:</label>
        <input
          className={inputStyles.input}
          type="text"
          name="listTitle"
          value={listTitle}
          onChange={(e) => handleListTitleChange(e.target.value)}
          placeholder="Enter list title"
          required
        />
      </div>
      <button type="button" className={`${styles.addItem} ${inputStyles.smallButton}`} onClick={handleAddItem}>
        Add Item
      </button>
      <button type="submit" className={inputStyles.smallButton}>
        Save List
      </button>
      <div className={styles.fieldHeader}>
        <span className={`${styles.columnHeader}`}>Item name</span>
        <span className={`${styles.columnHeader}`}>Quantity</span>
        <span className={`${styles.columnHeader}`}>Food Item</span>
      </div>
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
      {saveStatus === SaveState.LOADING && <div>Loading...</div>}
      {saveStatus === SaveState.SUCCESS && <div>Save successful ✅ Redirecting to new list...</div>}
      {saveStatus === SaveState.ERROR && <div>Save failed ❌</div>}
    </form>
  );
};

export default NewShoppingList;

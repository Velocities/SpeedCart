import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for unique item identification

import ShoppingListItem from '@components/ShoppingListItem';
import SaveButton from '@components/SaveButton';
import AddShoppingListItemButton from '@components/AddShoppingListItemButton';
import StatusModal from '@components/StatusModal'; // Import StatusModal to provide UI info on list save status
import { RequestStatus } from '@constants/enums.ts';

import styles from './NewShoppingList.module.css';
import inputStyles from '@modularStyles/inputs.module.css';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

const NewShoppingList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ id: Date.now(), name: '', is_food: false, quantity: 1 }]);
  const [listTitle, setListTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState(RequestStatus.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [addNItems, setAddNItems] = useState(1);

  useEffect(() => {
    document.title = "Create new shopping list";
  }, []);

  const handleListTitleChange = (newValue) => {
    setListTitle(newValue);
  };

  const handleAddItemChange = (event) => {
    setAddNItems(Number(event.target.value));
  };

  const handleAddItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      ...Array.from({ length: addNItems }, () => ({
        id: uuidv4(), // Use uuid to generate a separate unique ID for each separate item
        name: '',
        is_food: false,
        quantity: 1
      }))
    ]);
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
    setSaveStatus(RequestStatus.LOADING);

    try {
      //throw Error("this is a test");
      const shoppingList = await createShoppingList(listTitle); // Create the shopping list

      // Save each item to the created shopping list
      for (let item of items) {
        await createGroceryItem({ ...item, shopping_list_id: shoppingList.list_id });
      }

      setSaveStatus(RequestStatus.SUCCESS);
      // This needs to have a small delay so the user can know they're being redirected
      setTimeout(() => {
        navigate(`/shopping-list/${shoppingList.list_id}`);
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error creating shopping list or items:', error);
      setSaveStatus(RequestStatus.ERROR);
      setSaveError(error);
    }
  };

  const createShoppingList = async (name, routeId = null) => {
    const url = `${baseUrl}/shopping-lists`;

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

  const createGroceryItem = async (item) => {
    const url = `${baseUrl}/grocery-items`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return (
    <>
      <main className='main-content'>
        <form className={`${styles.shoppingList}`} onSubmit={handleSubmit}>
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
          <AddShoppingListItemButton callback={handleAddItem} />
          <select value={addNItems} onChange={handleAddItemChange}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          <SaveButton />
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
        </form>
      </main>
      <StatusModal status={saveStatus}
        loadingText='Loading...'
        successText='Save successful! Redirecting...'
        errorText={`Save failed! ${saveError}`}
      />
    </>
  );
};

export default NewShoppingList;

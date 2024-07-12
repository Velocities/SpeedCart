import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchGroceryItems from '@customHooks/fetchGroceryItems.js';
import fetchShoppingList from '@customHooks/fetchShoppingList.js';
import ShoppingListItem from '@components/ShoppingListItem';
import SaveButton from '@components/SaveButton';
import AddShoppingListItemButton from '@components/AddShoppingListItemButton';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for unique item identification
// CSS style imports
import inputStyles from '@modularStyles/inputs.module.css';
import styles from './ShoppingListDetail.module.css';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

const ShoppingListDetail = () => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedItems, setDeletedItems] = useState([]); // Any items deleted in the front end should obviously be removed from the database on the back end
  const [newItems, setNewItems] = useState([]); // Any new items added in the front end should be added to the database on the back end
  // These state variables are necessary if the user changes from editing mode to view mode
  const [originalShoppingList, setOriginalShoppingList] = useState(null);
  const [originalGroceryItems, setOriginalGroceryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addNItems, setAddNItems] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listData = await fetchShoppingList(id);
        setShoppingList(listData);

        // Necessary if the user goes from edit mode to view mode
        setOriginalShoppingList(listData);

        document.title = `Viewing list: ${listData.name}`;

        const itemsData = await fetchGroceryItems(id);
        setGroceryItems(itemsData);
        
        // Necessary if the user goes from edit mode to view mode
        setOriginalGroceryItems(itemsData);

        setLoading(false);

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const resetChanges = () => {
    // Reset form changes
    setShoppingList(originalShoppingList);
    setGroceryItems(originalGroceryItems);
    setDeletedItems([]);
    setNewItems([]);
  };

  const handleToggleEditing = (e) => {
    const editingState = e.target.checked;
  
    if (!editingState) {
      const userConfirmed = window.confirm("Are you sure you want to leave editing mode? Unsaved changes will be lost.");
      if (!userConfirmed) {
        return;
      } else {
        resetChanges();
      }
    } else {
      // When entering edit mode, store the current state as original state
      // (We might be able to remove this code)
      setOriginalShoppingList(shoppingList);
      setOriginalGroceryItems(groceryItems);
    }
  
    setIsEditing(editingState);
  };
  

  const handleItemChange = (index, updatedItem, itemsArray, setItemsArray) => {
    const updatedItems = itemsArray.map((item, i) => (i === index ? { ...item, ...updatedItem } : item));
    setItemsArray(updatedItems);
  };

  // We need the items array to know which array we are removing the item from
  const handleRemoveItem = (index, itemsArray, setItemsArray) => {
    const updatedItems = itemsArray.filter((_, i) => i !== index);
    setItemsArray(updatedItems);
    if (itemsArray === groceryItems) {
      // Put deleted item in deleteItems data structure
      const deletedItem = groceryItems[index];
      setDeletedItems([...deletedItems, deletedItem]);
    }
  };

  const handleRestoreItem = (index) => {
    const restoredItem = deletedItems[index];
    setDeletedItems((prevDeletedItems) =>
      prevDeletedItems.filter((_, i) => i !== index)
    );
    setGroceryItems((prevGroceryItems) => [...prevGroceryItems, restoredItem]);
  };

  const handleTitleChange = (e) => {
    setShoppingList({ ...shoppingList, name: e.target.value });
  };

  const handleAddItem = () => {
    setNewItems((prevItems) => [
      ...prevItems,
      ...Array.from({ length: addNItems }, () => ({
        id: uuidv4(), // Use uuid to generate a unique ID
        name: '',
        is_food: false,
        quantity: 1
      }))
    ]);
  };

  const handleAddItemChange = (event) => {
    setAddNItems(Number(event.target.value));
  };

  const handleReset = () => {
    const userConfirmed = window.confirm("Are you sure you want to reset your changes? Unsaved changes will be lost.");
    if (userConfirmed) {
      resetChanges();
    }
  };

  // Network function for creating a new grocery item in database
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Grab authentication token
      const authToken = localStorage.getItem('authToken');
      // Update shopping list title
      const listResponse = await fetch(`${baseUrl}/shopping-lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: shoppingList.name })
      });

      if (!listResponse.ok) {
        throw new Error('Failed to update shopping list title');
      }

      // Deleted items will be removed from the database

      // Update each existing grocery item
      const itemPromises = groceryItems.map(item =>
        fetch(`${baseUrl}/grocery-items/${item.item_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(item)
        })
      );

      await Promise.all(itemPromises);

      // Remove each grocery item that the user wants to delete
      const itemDeletePromises = deletedItems.map(item =>
        fetch(`${baseUrl}/grocery-items/${item.item_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(item)
        })
      );

      await Promise.all(itemDeletePromises);

      // Add each new item the user wants to add
      // Save each item to the created shopping list
      for (let item of newItems) {
        await createGroceryItem(authToken, { ...item, shopping_list_id: id });
      }


      // All network requests were successful if we ended up here; refresh the page
      // Refresh the page upon successful form submission
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <main className={`main-content`}>Loading...</main>;
  }

  if (error) {
    return <main className={`main-content`}>Error: {error}</main>;
  }

  return (
    <main className={`main-content ${styles.flexCenter}`}>
      <form onSubmit={handleSubmit} className={`${styles.innerContentArea} ${styles.form}`}>
        <div className={styles.formHeader}>
          <label htmlFor="editModeToggle">
            <input
              type="checkbox"
              id="editModeToggle"
              checked={isEditing}
              onChange={handleToggleEditing}
            />
            Edit Mode
          </label>
          <br />

          <label htmlFor="listTitle">Title of list:</label>
          {isEditing ? 
            <input
            type="text"
            id="listTitle"
            value={shoppingList.name}
            onChange={handleTitleChange}
            className={inputStyles.input}
            placeholder="Enter list title"
            disabled={!isEditing} // Disable input in view mode
            /> :
            <div>{shoppingList.name}</div>
          }

          {isEditing && (
            <>
              <AddShoppingListItemButton callback={handleAddItem} />
              <select value={addNItems} onChange={handleAddItemChange}>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              <SaveButton />
              <input type="reset" className={styles.resetBtn} onClick={handleReset} />
            </>
          )}
        </div>
        
        <div className={styles.formContent}>
          <h3>Grocery Items:</h3>
          <ul className={styles.noPadding}>
            {groceryItems.map((item, index) => (
              <ShoppingListItem
                key={item.item_id}
                item={item}
                index={index}
                onItemChange={(index, updatedItem) => handleItemChange(index, updatedItem, groceryItems, setGroceryItems)}
                onRemoveItem={(index) => handleRemoveItem(index, groceryItems, setGroceryItems)}
                isEditing={isEditing} // Pass editing state to child component
              />
            ))}
          </ul>

          {deletedItems.length > 0 && isEditing && (
            <div>
              <h4>Items to be deleted:</h4>
              <ul className={styles.noPadding}>
                {deletedItems.map((deletedItem, index) => (
                  <li key={index}>
                    {deletedItem.name}, Quantity: {deletedItem.quantity}, Is Food?: {deletedItem.is_food ? "Yes " : "No "}
                    <button onClick={() => handleRestoreItem(index)}>Restore</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {newItems.length > 0 && isEditing && (
            <div>
              <h4>Items to be added:</h4>
              <ul className={styles.noPadding}>
                {newItems.map((newItem, index) => (
                  <ShoppingListItem
                    key={newItem.id} // Changed to use newItem.id for unique key
                    item={newItem}
                    index={index}
                    onItemChange={(index, updatedItem) => handleItemChange(index, updatedItem, newItems, setNewItems)}
                    onRemoveItem={(index) => handleRemoveItem(index, newItems, setNewItems)}
                    isEditing={isEditing} // Pass editing state to child component
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default ShoppingListDetail;

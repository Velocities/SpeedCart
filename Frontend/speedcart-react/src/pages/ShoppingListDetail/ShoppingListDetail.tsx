import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for unique item identification
import { useParams } from 'react-router-dom';

import {
  fetchGroceryItems,
  fetchShoppingList,
  createGroceryItem,
  updateShoppingListTitle,
  updateGroceryItem,
  deleteGroceryItem
} from 'shared';

import ShoppingListItem from '@components/ShoppingListItem';
import SaveButton from '@components/SaveButton';
import AddShoppingListItemButton from '@components/AddShoppingListItemButton';
import StatusModal from '@components/StatusModal';

import { RequestStatus } from '@constants/enums';

// CSS style imports
import inputStyles from '@modularStyles/inputs.module.css';
import styles from './ShoppingListDetail.module.css';

const ShoppingListDetail = () => {
  const { id } = useParams() as { id: string };
  const [shoppingList, setShoppingList] = useState(null);
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStatus, setEditStatus] = useState(RequestStatus.IDLE);
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

        const itemsDataResponse = await fetchGroceryItems(id);
        if (!itemsDataResponse.ok) {
          throw new Error(`Failed to fetch grocery items for shopping list with ID ${id}`);
        }

        const itemsData: any = await itemsDataResponse.json();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditStatus(RequestStatus.LOADING);

    try {
      // Grab authentication token
      const authToken = localStorage.getItem('speedcart_auth_exists');
      if (!authToken) {
        throw new Error("You're not signed in; please go sign in first");
      }
      // Update shopping list title
      const listResponse = await updateShoppingListTitle(shoppingList.name, id);

      if (!listResponse.ok) {
        throw new Error('Failed to update shopping list title');
      }

      // Deleted items will be removed from the database

      // Update each existing grocery item
      const itemPromises = groceryItems.map(item =>updateGroceryItem(item));

      await Promise.all(itemPromises);

      // Remove each grocery item that the user wants to delete
      const itemDeletePromises = deletedItems.map(item => deleteGroceryItem(item));

      await Promise.all(itemDeletePromises);

      // Add each new item the user wants to add
      const itemCreationPromises = newItems.map(item => createGroceryItem({ ...item, shopping_list_id: id }));

      await Promise.all(itemCreationPromises);

      setEditStatus(RequestStatus.SUCCESS);


      // All network requests were successful if we ended up here; refresh the page
      // Refresh the page upon successful form submission
      // This needs to have a small delay so the user can know they're being redirected
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay
      
    } catch (error) {
      setEditStatus(RequestStatus.ERROR);
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
    <>
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
            <div className={styles.shoppingListItems}>
              <div className={styles.fieldHeader}>
                <div className={`${styles.columnHeader}`}>Item name</div>
                <div className={`${styles.columnHeader}`}>Quantity</div>
                <div className={`${styles.columnHeader}`}>Food Item</div>
                <div className={`${styles.columnHeader}`}>Delete Item</div>
              </div>
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
          </div>
        </form>
      </main>
      <StatusModal status={editStatus}
        loadingText='Loading...'
        successText='Edit save successful! Refreshing page...'
        errorText={`Edit save failed! ${error}`}
      />
    </>
  );
};

export default ShoppingListDetail;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for unique item identification

import { CrudMode } from '@constants/crudmodes';
import { AuthContextType, createGroceryItem, createShoppingList, deleteGroceryItem, updateGroceryItem, updateShoppingListTitle, useAuth } from 'shared';

const ShoppingListContext = createContext(null);

// This component handles all state-related work for any pages
// that deal with saving shopping lists
export const ShoppingListProvider = ({ children }) => {
  const { callBackendAPI }: AuthContextType = useAuth();
  const [shoppingListIDIsLoading, setShoppingListIDIsLoading] = useState<boolean>(true);
  const [listTitle, setListTitle] = useState<string>('');
  const [listID, setListID] = useState<number>(null);
  const [addNItems, setAddNItems] = useState<number>(1);
  const [existingItems, setExistingItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]); // Any items deleted in the front end should obviously be removed from the database on the back end
  const [newItems, setNewItems] = useState([]); // Any new items added in the front end should be added to the database on the back end
  const [crudMode, setCrudMode] = useState<CrudMode>(CrudMode.READ);
  // These state variables are necessary if the user changes from editing mode to view mode
  const [originalShoppingList, setOriginalShoppingList] = useState(null);
  const [originalGroceryItems, setOriginalGroceryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState(null); // This is the ShoppingList object (used for update/edit page for existing shopping lists)

  useEffect(() => {
    // Set loading to false after the status is determined
    if (listID !== null) {
      setShoppingListIDIsLoading(false);
    }
  }, [listID]);

  // Handlers for all changes to state
  const handleNewItemChange = (index, newItem) => {
    const newItemsTemp = [...newItems];
    newItemsTemp[index] = newItem;
    setNewItems(newItemsTemp);
  };
  
  const handleNewListTitleChange = (newValue: string) => {
    setListTitle(newValue);
  };

  const handleExistingListTitleChange = (e) => {
    setShoppingList({ ...shoppingList, name: e.target.value });
  };

  const handleAddItemChange = (event) => {
    setAddNItems(Number(event.target.value));
  };

  const handleAddItem = () => {
    setNewItems((prevItems) => [
      ...prevItems,
      ...Array.from({ length: addNItems }, () => ({
        id: uuidv4(), // Use uuid to generate a separate unique ID for each separate item
        name: '',
        is_food: false,
        quantity: 1
      }))
    ]);
  };

  const handleRemoveNewItem = (index) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  // The following 2 functions need to be tested and integrated properly

  const handleUpdatedItemChange = (index, updatedItem) => {
    const updatedItems = existingItems.map((item, i) => (i === index ? { ...item, ...updatedItem } : item));
    setExistingItems(updatedItems);
  };

  // We need the items array to know which array we are removing the item from
  const handleRemoveExistingItem = (index, itemsArray, setItemsArray) => {
    const updatedItems = itemsArray.filter((_, i) => i !== index);
    setItemsArray(updatedItems);
    if (itemsArray === existingItems) {
      // Put deleted item in deleteItems data structure
      const deletedItem = existingItems[index];
      setDeletedItems([...deletedItems, deletedItem]);
    }
  };

  const handleRestoreItem = (index) => {
    const restoredItem = deletedItems[index];
    setDeletedItems((prevDeletedItems) =>
      prevDeletedItems.filter((_, i) => i !== index)
    );
    setExistingItems((prevGroceryItems) => [...prevGroceryItems, restoredItem]);
  };

  // Submit handler to handle all necessary Promise types
  // Note: This handler can work for creating new lists or updating existing ones
  // (DELETING AN ENTIRE LIST IS OUTSIDE THE SCOPE OF THIS ENTIRE CONTEXT PROVIDER)
  const handleSubmitListChanges = async () => {
    let currentListID = null;
    
    if (crudMode === CrudMode.CREATE) {
      // We're creating a new list
      const shoppingListResponse: Response = await callBackendAPI(createShoppingList, {
        name: listTitle,
        route_id: null,
      });
      
      if (!shoppingListResponse.ok) {
        throw new Error(`HTTP error! status: ${shoppingListResponse.status}`);
      }
      const shoppingListCreated: any = await shoppingListResponse.json();

      setListID(shoppingListCreated.list_id);
      currentListID = shoppingListCreated.list_id;
      setShoppingList(shoppingListCreated);
    } else {
      // We're updating an existing list
      // Update shopping list title
      const listResponse: Response = await callBackendAPI(updateShoppingListTitle, {
        shoppingListName: shoppingList.name,
        shoppingListId: listID.toString()
      });

      if (!listResponse.ok) {
        throw new Error('Failed to update shopping list title');
      }
      currentListID = listID;
    }

    if (existingItems.length > 0) {
      // Update each existing grocery item
      const itemPromises = existingItems.map(item => callBackendAPI(updateGroceryItem, {
        item: item
      }));

      await Promise.all(itemPromises);
    }

    if (deletedItems.length > 0) {
      // Remove each grocery item that the user wants to delete
      const itemDeletePromises = deletedItems.map(item => callBackendAPI(deleteGroceryItem, {
        item: item
      }));

      await Promise.all(itemDeletePromises);
    }

    if (newItems.length > 0) {
      // Add each new item the user wants to add
      const itemCreationPromises = newItems.map(item => callBackendAPI(createGroceryItem, {
         item: {
          ...item,
          shopping_list_id: currentListID
         }
      }));

      await Promise.all(itemCreationPromises);
    }
    
  };

  return (
    <ShoppingListContext.Provider value={{
      shoppingListIDIsLoading, // Necessary for when component mounts
      crudMode, setCrudMode,
      listTitle, setListTitle, handleNewListTitleChange, handleExistingListTitleChange,
      listID, setListID,
      existingItems, setExistingItems,
      deletedItems, setDeletedItems, handleRestoreItem,
      newItems, setNewItems, handleAddItem,
      addNItems, setAddNItems, handleAddItemChange,
      originalShoppingList, setOriginalShoppingList,
      originalGroceryItems, setOriginalGroceryItems,
      shoppingList, setShoppingList,
      /* Handlers for all state changes */
      handleNewItemChange, handleRemoveNewItem,
      handleUpdatedItemChange, handleRemoveExistingItem,
      handleSubmitListChanges }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingListContext = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingListContext must be used within an AuthProvider");
  }
  return context;
};
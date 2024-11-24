import { CrudMode } from '@constants/crudmodes';
import React, { createContext, useContext, useState } from 'react';
import { GroceryItem } from 'shared';

const ShoppingListContext = createContext(null);

// This component handles all state-related work for any pages
// that deal with saving shopping lists
export const ShoppingListProvider = ({ children }) => {
  const [listTitle, setListTitle] = useState<string>('');
  const [addNItems, setAddNItems] = useState<number>(1);
  const [existingItems, setExistingItems] = useState<GroceryItem>([{ id: Date.now(), name: '', is_food: false, quantity: 1 }]);
  const [deletedItems, setDeletedItems] = useState([]); // Any items deleted in the front end should obviously be removed from the database on the back end
  const [newItems, setNewItems] = useState([]); // Any new items added in the front end should be added to the database on the back end
  const [crudMode, setCrudMode] = useState<CrudMode>(CrudMode.READ);

  // Handlers for all changes to state
  const handleNewItemChange = (index, newItem) => {
    const newItemsTemp = [...newItems];
    newItemsTemp[index] = newItem;
    setNewItems(newItemsTemp);
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

  // Submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    // Submission logic (e.g., API call)
  };

  // API Call Handlers
  const createItem = async (item) => {
    // Example API call for creating an item
    console.log('Creating item:', item);
    // Assume API call here
  };

  const updateItem = async (itemId, updatedData) => {
    // Example API call for updating an item
    console.log('Updating item:', itemId, updatedData);
    // Assume API call here
  };

  const deleteItem = async (itemId) => {
    // Example API call for deleting an item
    console.log('Deleting item:', itemId);
    // Assume API call here
  };

  return (
    <ShoppingListContext.Provider value={{ 
      crudMode, setCrudMode,
      listTitle, setListTitle,
      existingItems, setExistingItems,
      deletedItems, setDeletedItems, handleRestoreItem,
      newItems, setNewItems,
      addNItems, setAddNItems,
      /* Handlers for all state changes */
      handleNewItemChange, handleRemoveNewItem,
      handleUpdatedItemChange, handleRemoveExistingItem,
      handleSubmit }}>
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
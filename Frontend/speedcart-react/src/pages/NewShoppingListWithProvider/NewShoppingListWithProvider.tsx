import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for unique item identification
import { useAuth, createGroceryItem, createShoppingList, GroceryItem, AuthContextType } from 'shared';

import SaveButton from '@components/SaveButton';
import AddShoppingListItemButton from '@components/AddShoppingListItemButton';
import StatusModal from '@components/StatusModal'; // Import StatusModal to provide UI info on list save status
import ShoppingListSection from '@components/ShoppingListSection';

import { ShoppingListProvider, useShoppingListContext } from '@customHooks/ShoppingListContext';
import { RequestStatus } from '@constants/enums';
import { AppRoute } from '@constants/routes';
import { CrudMode } from '@constants/crudmodes';

import styles from './NewShoppingListWithProvider.module.css';
import inputStyles from '@modularStyles/inputs.module.css';

const NewShoppingList: React.FC = () => {
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState(RequestStatus.IDLE);
  const [saveError, setSaveError] = useState(null);
  const { isAuthenticated, loading }: AuthContextType = useAuth();
  // Necessary Context hooks
  const { listTitle, setListTitle,
    newItems, setNewItems,
    addNItems, setAddNItems,
    handleNewItemChange, handleRemoveNewItem,
    crudMode, setCrudMode } = useShoppingListContext();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`${AppRoute.LOGIN}?redirect=${AppRoute.NEW_SHOPPING_LIST}&redirectPageName=${"list creation page"}`);
    }
    if (!loading) {
      document.title = "Create new shopping list";
    }
    
    setCrudMode(CrudMode.CREATE);

  }, [isAuthenticated, loading, navigate]);

  const handleListTitleChange = (newValue: string) => {
    setListTitle(newValue);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveStatus(RequestStatus.LOADING);

    try {
      const shoppingListResponse = await createShoppingList(listTitle); // Create the shopping list
      if (!shoppingListResponse.ok) {
        throw new Error(`HTTP error! status: ${shoppingListResponse.status}`);
      }

      const shoppingList: any = await shoppingListResponse.json();

      // Save each item to the created shopping list
      const itemCreationPromises = newItems.map(item => createGroceryItem({ ...item, shopping_list_id: shoppingList.list_id }));

      await Promise.all(itemCreationPromises);

      setSaveStatus(RequestStatus.SUCCESS);
      // This needs to have a small delay so the user can know they're being redirected
      setTimeout(() => {
        navigate(`${AppRoute.SHOPPING_LIST_DETAIL}/${shoppingList.list_id}`);
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error creating shopping list or items:', error);
      setSaveStatus(RequestStatus.ERROR);
      setSaveError(error);
    }
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
          <ShoppingListSection
            title={'Items to add to list'}
            items={newItems}
            onItemChange={handleNewItemChange}
            onRemoveItem={handleRemoveNewItem}
            isEditing={true}
            crudMode={crudMode}
          />
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

// Wrapping NewShoppingList with ShoppingListProvider
const NewShoppingListWithProvider = () => (
  <ShoppingListProvider>
    <NewShoppingList />
  </ShoppingListProvider>
);

export default NewShoppingListWithProvider;

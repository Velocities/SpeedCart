import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import { useAuth, AuthContextType } from 'shared';

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
  const { shoppingListIDIsLoading,
    listTitle, handleNewListTitleChange,
    newItems, handleAddItem,
    addNItems, handleAddItemChange,
    handleNewItemChange, handleRemoveNewItem,
    crudMode, setCrudMode,
    listID,
    handleSubmitListChanges } = useShoppingListContext();

  useEffect(() => {
    // The AuthContext needs time to load; this makes sure we wait until we're
    // absolutely certain that the user is not logged in
    if (!loading && !isAuthenticated) {
      navigate(`${AppRoute.LOGIN}?redirect=${AppRoute.NEW_SHOPPING_LIST}&redirectPageName=${"list creation page"}`);
    }
    if (!loading) {
      document.title = "Create new shopping list";
    }
    
    setCrudMode(CrudMode.CREATE);

  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // This is for the submission handler
    if (!shoppingListIDIsLoading && saveStatus === RequestStatus.SUCCESS) {
      // This needs to have a small delay so the user can know they're being redirected
      setTimeout(() => {
        navigate(`${AppRoute.SHOPPING_LIST_DETAIL}/${listID}`);
      }, 2000); // 2-second delay
    }
  }, [shoppingListIDIsLoading, saveStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveStatus(RequestStatus.LOADING);

    try {
      await handleSubmitListChanges();

      setSaveStatus(RequestStatus.SUCCESS);
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
              onChange={(e) => handleNewListTitleChange(e.target.value)}
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

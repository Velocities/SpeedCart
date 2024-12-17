import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  fetchGroceryItems,
  fetchShoppingList,
} from 'shared';

import SaveButton from '@components/SaveButton';
import AddShoppingListItemButton from '@components/AddShoppingListItemButton';
import ShoppingListSection from '@components/ShoppingListSection';

import { ShoppingListProvider, useShoppingListContext } from '@customHooks/ShoppingListContext';
import { CrudMode } from '@constants/crudmodes';
import { RequestStatus } from '@constants/enums';

// CSS style imports
import inputStyles from '@modularStyles/inputs.module.css';
import styles from './ShoppingListDetailWithProvider.module.css';
import PageLayout from '@components/PageLayout';

const ShoppingListDetail = () => {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStatus, setEditStatus] = useState(RequestStatus.IDLE);
  const [isEditing, setIsEditing] = useState(false);
  const { crudMode, setCrudMode,
    newItems, setNewItems,
    handleExistingListTitleChange,
    existingItems, setExistingItems,
    deletedItems, setDeletedItems,
    addNItems, handleAddItem, handleAddItemChange,
    handleNewItemChange, handleRemoveNewItem,
    originalShoppingList, setOriginalShoppingList,
    originalGroceryItems, setOriginalGroceryItems,
    shoppingList, setShoppingList,
    setListID,
    handleUpdatedItemChange,
    handleRemoveExistingItem,
    handleSubmitListChanges } = useShoppingListContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listData = await fetchShoppingList(id);
        setShoppingList(listData);
        setListID(id);

        // Necessary if the user goes from edit mode to view mode
        setOriginalShoppingList(listData);

        document.title = `Viewing list: ${listData.name}`;

        const itemsDataResponse = await fetchGroceryItems(id);
        if (!itemsDataResponse.ok) {
          throw new Error(`Failed to fetch grocery items for shopping list with ID ${id}`);
        }

        const itemsData: any = await itemsDataResponse.json();
        setExistingItems(itemsData);
        
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
    setExistingItems(originalGroceryItems);
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
        setCrudMode(CrudMode.READ);
        resetChanges();
      }
    } else {
      // When entering edit mode, store the current state as original state
      // (We might be able to remove this code)
      setCrudMode(CrudMode.UPDATE);
    }
  
    setIsEditing(editingState);
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
      await handleSubmitListChanges();

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
    return <PageLayout>Loading...</PageLayout>;
  }

  if (error) {
    return <PageLayout>Error: {error}</PageLayout>;
  }

  return (
    <>
      <PageLayout className={styles.flexCenter}
        status={editStatus}
        showStatusModal={true}
        modalProps={{
          loadingText:'Loading...',
          successText:'Edit save successful! Refreshing page...',
          errorText:`Edit save failed! ${error}`
        }}
      >
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
              onChange={handleExistingListTitleChange}
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
            <ShoppingListSection
              title={'Grocery Items:'}
              items={existingItems}
              onItemChange={(index, updatedItem) => handleUpdatedItemChange(index, updatedItem)}
              onRemoveItem={(index) => handleRemoveExistingItem(index, existingItems, setExistingItems)}
              isEditing={isEditing}
              crudMode={crudMode}
            />

            {deletedItems.length > 0 && isEditing && (
              <ShoppingListSection
                title={'Items to be deleted:'}
                items={deletedItems}
                onItemChange={handleNewItemChange}
                onRemoveItem={handleRemoveNewItem}
                isEditing={true}
                crudMode={CrudMode.DELETE}
              />
            )}

            {newItems.length > 0 && isEditing && (
              <ShoppingListSection
                title={'Items to be added:'}
                items={newItems}
                onItemChange={handleNewItemChange}
                onRemoveItem={handleRemoveNewItem}
                isEditing={true}
                crudMode={CrudMode.CREATE}
              />
            )}
          </div>
        </form>
      </PageLayout>
    </>
  );
};
const ShoppingListDetailWithProvider = () => (
  <ShoppingListProvider>
    <ShoppingListDetail />
  </ShoppingListProvider>
);

export default ShoppingListDetailWithProvider;

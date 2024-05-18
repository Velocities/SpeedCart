import React, { useState } from 'react';
import './NewShoppingList.css'; // Create this CSS file for styling
import mainSiteStyles from '../../pages/main.module.css';

// Enum for form submission state
const SaveState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const NewShoppingList = () => {
  const [items, setItems] = useState(['']); // Initial state with an empty item
  const [listTitle, setListTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState(SaveState.IDLE);

  const handleListTitleChange = (newValue) => {
    setListTitle(newValue);
  }

  const handleInputChange = (index, key, value) => {
    const newItems = [...items];
    if (key === 'name') {
      newItems[index] = { ...newItems[index], [key]: value }; // Update only the name property
      console.log("Item name: " + newItems[index].name);
    } else if (key === 'isFood') {
      newItems[index] = { ...newItems[index], [key]: value }; // Update only the isFood property
      console.log("Item isFood status: " + newItems[index].isFood);
    }
    setItems(newItems);
  };
  

  const handleAddItem = () => {
    setItems([...items, { name: '', isFood: false }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaveStatus(SaveState.LOADING);
    setTimeout(() => {
      console.log("processing and sending data to API...");
      // API endpoint for saving shopping lists
    const apiUrl = 'https://www.speedcartapp.com/api/DataManager.php';

    // Create shopping list
    // Prepare the data to be sent
    const data = {
      database: "speedcart",
      tblName: "shopping_lists",
      data: {
        // user_id is determined by authentication endpoint
        list_name: listTitle,
        // not sure why chatgpt said "created_at" was a parameter, but we'll likely use that elsewhere
      }
      //items: items.filter(item => item.trim() !== ''), // Remove empty items
    };

    console.log("List title being sent: " + listTitle);
    console.log("Items being sent: ", items.filter(item => typeof item.name === 'string' && item.name.trim() !== ''));
    /*items.forEach((item) => {
      console.log("Item name = ", item.name);
      console.log("Item isFood = ", item.isFood);
    })*/

    // Grab JWT for authentication
    /*const token = localStorage.getItem('authToken');

    // Make a POST request to your API
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
        // Add any other headers your API might require
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Shopping list saved successfully:', result);
        // Optionally, you can perform additional actions after successful submission
      })
      .catch(error => {
        console.error('Error saving shopping list:', error);
        // Handle errors here
      });

      // Add items to shopping list
      const itemData = {
        database: "speedcart",
        tblName: "shopping_list_items",
        data: {
          // user_id is determined by authentication endpoint
          list_name: listTitle,
        }
        //items: items.filter(item => item.trim() !== ''), // Remove empty items
      };
      fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
          // Add any other headers your API might require
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(result => {
        console.log('Shopping list saved successfully:', result);
        // Optionally, you can perform additional actions after successful submission
      })
      .catch(error => {
        console.error('Error saving shopping list:', error);
        // Handle errors here
      });*/
    setSaveStatus(SaveState.SUCCESS);
    }, 2000);
  };

  return (
    <form className={`shopping-list ${mainSiteStyles.topElement}`}>
      <label htmlFor="listTitle">Title of new list:</label>
      <input type="text" name="listTitle" onChange={(e) => handleListTitleChange(e.target.value)}></input>
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <input
          type="text"
          value={item.name} // Use item.name for the value
          onChange={(e) => handleInputChange(index, 'name', e.target.value)} // Pass 'name' as the key
        />

        <input
          type="checkbox"
          checked={item.isFood}
          onChange={(e) => handleInputChange(index, 'isFood', e.target.checked)} // Pass 'isFood' as the key
        />

          {index < items.length - 1 && (
            <button className="trash-bin" onClick={() => handleRemoveItem(index)}>
              🗑️
            </button>
          )}
        </div>
      ))}
      <button type="button" className="add-item" onClick={handleAddItem}>
        Add Item
      </button>
      <button type="submit" className="save-list" onClick={handleSubmit}>
        Save List
      </button>
      {saveStatus === SaveState.LOADING && (
        <>
          {'\u25CC'}
        </>  
      )}
      {saveStatus === SaveState.SUCCESS && (
        <>
          Save successful {'\u2705'}
        </>
      )}
      {saveStatus === SaveState.ERROR && (
        <>
          Save failed {'\u274C'}
        </>
      )}
    </form>
  );
};

export default NewShoppingList;

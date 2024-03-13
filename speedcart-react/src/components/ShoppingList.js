import React, { useState } from 'react';
import './css/ShoppingList.css'; // Create this CSS file for styling
import mainSiteStyles from './css/main.module.css';

const ShoppingList = () => {
  const [items, setItems] = useState(['']); // Initial state with an empty item
  const [listTitle, setListTitle] = useState('');

  const handleListTitleChange = (newValue) => {
    setListTitle(newValue);
  }

  const handleInputChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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

    // Grab JWT for authentication
    const token = localStorage.getItem('authToken');

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
      });
  };

  return (
    <form className={`shopping-list ${mainSiteStyles.topElement}`}>
      <label for="listTitle">Title of new list:</label>
      <input type="text" name="listTitle" onChange={(e) => handleListTitleChange(e.target.value)}></input>
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <input
            type="text"
            value={item}
            onChange={(e) => handleInputChange(index, e.target.value)}
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
    </form>
  );
};

export default ShoppingList;

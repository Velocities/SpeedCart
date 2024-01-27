import React, { useState } from 'react';
import './css/ShoppingList.css'; // Create this CSS file for styling
import mainSiteStyles from './css/main.module.css';

const ShoppingList = () => {
  const [items, setItems] = useState(['']); // Initial state with an empty item

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

  const handleSubmit = () => {
    // Assuming you have an API endpoint for saving shopping lists
    const apiUrl = 'https://www.speedcartapp.com/api/DataManager.php';

    // Prepare the data to be sent
    const data = {
      items: items.filter(item => item.trim() !== ''), // Remove empty items
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
  };

  return (
    <div className={`shopping-list ${mainSiteStyles.topElement}`}>
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
      <button className="add-item" onClick={handleAddItem}>
        Add Item
      </button>
      <button className="save-list" onClick={handleSubmit}>
        Save List
      </button>
    </div>
  );
};

export default ShoppingList;

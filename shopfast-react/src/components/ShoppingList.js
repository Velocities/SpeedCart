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
    </div>
  );
};

export default ShoppingList;

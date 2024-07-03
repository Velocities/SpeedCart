import React from 'react';
import styles from "./ShoppingListItem.module.css";
import inputStyles from '@modularStyles/inputs.module.css';
import IntegerQuantityValue from "../IntegerQuantityValue";

function ShoppingListItem({ item, index, onItemChange, onRemoveItem, isEditing }) {
  const handleInputChange = (key, value) => {
    onItemChange(index, { ...item, [key]: value });
  };

  const handleQuantityChange = (value) => {
    handleInputChange('quantity', value);
  };

  return (
    <>
      {isEditing ? (
        <li className={styles.listItem}>
          <input
            type="text"
            value={item.name}
            className={`${inputStyles.input} ${styles.itemName}`}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter item name"
            required
          />
          <IntegerQuantityValue value={item.quantity} onChange={handleQuantityChange} />
          <input
            type="checkbox"
            checked={item.is_food}
            className={styles.isFoodCheckbox}
            onChange={(e) => handleInputChange('is_food', e.target.checked)}
          />
          <button type="button" className={styles.trashBin} onClick={() => onRemoveItem(index)}>
            🗑️
          </button>
        </li>) :
        (<li>
          {/* View-only elements */}
          <>{item.name}, Quantity: {item.quantity}, Is Food? {item.is_food ? "Yes" : "No"}</>
          {/* Other elements for viewing */}
        </li>)}
    </>
  );
}

export default ShoppingListItem;

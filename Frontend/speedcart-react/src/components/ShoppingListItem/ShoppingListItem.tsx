import React from 'react';

import IntegerQuantityValue from '@components/IntegerQuantityValue';
import CustomCheckbox from '@components/CustomCheckbox';
import { CrudMode } from '@constants/crudmodes';

import styles from './ShoppingListItem.module.css';
import inputStyles from '@modularStyles/inputs.module.css';
import { useShoppingListContext } from '@customHooks/ShoppingListContext';

function ShoppingListItem({ item, index, onItemChange, onRemoveItem, isEditing, crudMode = CrudMode.READ, className = '' }) {
  const { handleRestoreItem } = useShoppingListContext();
  
  const handleInputChange = (key, value) => {
    onItemChange(index, { ...item, [key]: value });
  };

  const handleQuantityChange = (value) => {
    handleInputChange('quantity', value);
  };

  return (
    <li className={`${styles.listItem} ${className}`}>
      {isEditing ?
        <>
          <div>
            <input
            type="text"
            value={item.name}
            className={`${inputStyles.input} ${styles.itemName}`}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter item name"
            required
            />
          </div>
          <IntegerQuantityValue value={item.quantity} onChange={handleQuantityChange} />
          <div className={styles.checkboxWrapper}>
            <CustomCheckbox
              checked={item.is_food}
              className={styles.isFoodCheckbox}
              onChange={(e) => handleInputChange('is_food', e.target.checked)}
            />
          </div>
          <div>
            {(crudMode == CrudMode.UPDATE || crudMode == CrudMode.CREATE) &&
              <button
                type="button"
                className={styles.trashBin}
                onClick={() => onRemoveItem(index)}
              >
                🗑️
              </button>
            }
            {crudMode == CrudMode.DELETE &&
              <button onClick={() => handleRestoreItem(index)}>Restore</button>
            }
          </div>
        </>
        : 
        (<>
          {/* View-only elements */}
            <>
              <div>{item.name}</div>
              <div>{item.quantity}</div>
              <div>{item.is_food ? "Yes" : "No"}</div>
            </>
          {/* Other elements for viewing */}
        </>)}
    </li>
  );
}

export default ShoppingListItem;

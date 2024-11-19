// ShoppingListSection.js
import React from 'react';
import ShoppingListItem from '@components/ShoppingListItem';
import { CrudMode } from '@constants/crudmodes';

import styles from './ShoppingListSection.module.css';

const ShoppingListSection = ({ title, items, onItemChange, onRemoveItem, isEditing, titleClassName = '', crudMode = CrudMode.READ }) => {

  return (
    <section>
      <h3 className={titleClassName}>{title}</h3>
      <div className={styles.shoppingListItems}>
        <div className={styles.fieldHeader}>
          <div className={`${styles.columnHeader}`}>Item name</div>
          <div className={`${styles.columnHeader}`}>Quantity</div>
          <div className={`${styles.columnHeader}`}>Food Item</div>
          {isEditing && <div className={`${styles.columnHeader}`}>Delete Item</div>}
        </div>
        {items.map((item, index) => (
          <ShoppingListItem
            index={index}
            key={item.id || item.item_id}
            item={item}
            onItemChange={onItemChange}
            onRemoveItem={onRemoveItem}
            isEditing={isEditing}
            className={styles.row}
            crudMode={crudMode}
          />
        ))}
      </div>
    </section>
  );
};

export default ShoppingListSection;

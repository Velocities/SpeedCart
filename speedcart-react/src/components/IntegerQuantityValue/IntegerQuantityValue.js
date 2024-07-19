import React from 'react';
import styles from './IntegerQuantityValue.module.css';

const IntegerQuantityValue = ({ value, onChange }) => {

  const increment = (event) => {
    event.preventDefault();
    const newValue = value + 1;
    onChange(newValue);
  };

  const decrement = (event) => {
    event.preventDefault();
    // Ensures we don't set a quantity below 1 (if an item is present in the list,
    // obviously you need at least 1 of that item)
    if (value > 1) {
      const newValue = value - 1;
      onChange(newValue);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.buttonWrapper}><button className={styles.button} onClick={decrement}>-</button></span>
      <span className={styles.value}>{value}</span>
      <span className={styles.buttonWrapper}><button className={styles.button} onClick={increment}>+</button></span>
    </div>
  );
};

export default IntegerQuantityValue;

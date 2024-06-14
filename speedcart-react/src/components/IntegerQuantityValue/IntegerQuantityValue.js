import React, { useState } from 'react';
import styles from './IntegerQuantityValue.module.css';

const IntegerQuantityValue = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const increment = (event) => {
    event.preventDefault();
    const newValue = localValue + 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const decrement = (event) => {
    event.preventDefault();
    // Ensures we don't set a quantity below 1 (if an item is present in the list,
    // obviously you need at least 1 of that item)
    if (localValue > 1) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.buttonWrapper}><button className={styles.button} onClick={decrement}>-</button></span>
      <span className={styles.value}>{localValue}</span>
      <span className={styles.buttonWrapper}><button className={styles.button} onClick={increment}>+</button></span>
    </div>
  );
};

export default IntegerQuantityValue;

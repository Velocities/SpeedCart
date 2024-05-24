import React, { useState } from 'react';
import './IntegerQuantityValue.css';

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
    if (localValue > 0) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <>
      <button onClick={decrement}>-</button>
      {localValue}
      <button onClick={increment}>+</button>
    </>
  );
};

export default IntegerQuantityValue;

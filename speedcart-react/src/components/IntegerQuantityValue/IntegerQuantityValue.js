import React, { useState } from 'react';
import './IntegerQuantityValue.css';

const IntegerQuantityValue = (props) => {
  const [value, setValue] = useState(0);

  const increment = (event) => {
    event.preventDefault();
    setValue(value+1);
  }

  const decrement = (event) => {
    event.preventDefault();
    if (value != 0) {
        setValue(value-1);
    }
  }

  return (
    <>
        <button onClick={decrement}>-</button>
        {value}
        <button onClick={increment}>+</button>
    </>
  );
};

export default IntegerQuantityValue;

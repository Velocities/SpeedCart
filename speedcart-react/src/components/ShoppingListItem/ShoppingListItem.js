import IntegerQuantityValue from "../IntegerQuantityValue";

function ShoppingListItem({ item, index, onItemChange, onRemoveItem }) {
  const handleInputChange = (key, value) => {
    onItemChange(index, { ...item, [key]: value });
  };

  const handleQuantityChange = (value) => {
    handleInputChange('quantity', value);
  };

  return (
    <div className="list-item">
      <input
        type="text"
        value={item.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
      />
      <IntegerQuantityValue value={item.quantity} onChange={handleQuantityChange} />
      <input
        type="checkbox"
        checked={item.is_food}
        onChange={(e) => handleInputChange('is_food', e.target.checked)}
      />
      <button type="button" className="trash-bin" onClick={() => onRemoveItem(index)}>
        🗑️
      </button>
    </div>
  );
}

export default ShoppingListItem;

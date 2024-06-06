import IntegerQuantityValue from "../IntegerQuantityValue";

function ShoppingListItem( { item, index, handleInputChange, handleRemoveItem, handleQuantityChange } ) {
    return (
        <div key={index} className="list-item">
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
          />
          <IntegerQuantityValue value={item.quantity} onChange={(value) => handleQuantityChange(index, value)} />
          <input
            type="checkbox"
            checked={item.is_food}
            onChange={(e) => handleInputChange(index, 'is_food', e.target.checked)}
          />
          <button type="button" className="trash-bin" onClick={() => handleRemoveItem(index)}>
            🗑️
          </button>
        </div>
    );
}

export default ShoppingListItem;
import styles from './AddShoppingListItemButton.module.css';
import inputStyles from '@modularStyles/inputs.module.css';

function AddShoppingListItemButton( { callback } ) {
    return (
        <button type="button" className={`${styles.addItem} ${inputStyles.smallButton}`} onClick={callback}>
            Add Item
        </button>
    );
}

export default AddShoppingListItemButton;
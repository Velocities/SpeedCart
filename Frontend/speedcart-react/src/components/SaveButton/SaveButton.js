import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import styles from './SaveButton.module.css';
import inputStyles from '@modularStyles/inputs.module.css';

// Actual save functionality should be achieved by the form
// this button is used within
function SaveButton() {
    return (
        <button type="submit" className={`${inputStyles.smallButton} ${styles.saveButton}`}>
          Save List <FontAwesomeIcon icon={faSave} />
        </button>
    );
}

export default SaveButton;
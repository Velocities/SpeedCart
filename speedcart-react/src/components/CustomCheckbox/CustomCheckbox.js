import React from 'react';
import styles from './CustomCheckbox.module.css';

const CustomCheckbox = ({ checked = false, onChange, children, disabled = false }) => {
    return (
        <label className={`${styles.labelContainer} ${disabled ? styles.disabled : ''}`}>
            <input
                type="checkbox"
                className={styles.input}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <span className={styles.checkmark}></span>
            {children}
        </label>
    );
};

export default CustomCheckbox;

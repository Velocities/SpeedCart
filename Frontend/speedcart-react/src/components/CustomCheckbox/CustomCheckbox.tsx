import React from 'react';
import styles from './CustomCheckbox.module.css';

const CustomCheckbox = ({ name = '', className = '', checked = false, onChange = null, disabled = false, children = null}) => {
    return (
        <label className={`${styles.labelContainer} ${className} ${disabled ? styles.disabled : ''}`}>
            <input
                type="checkbox"
                className={styles.input}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                name={name}
            />
            <span className={styles.checkmark}></span>
            {children}
        </label>
    );
};

export default CustomCheckbox;

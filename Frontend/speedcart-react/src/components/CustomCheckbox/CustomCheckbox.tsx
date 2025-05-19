import React from 'react';
import styles from './CustomCheckbox.module.css';

const CustomCheckbox = ({ name = '', className = '', flexType = 'inlineFlex', checked = false, onChange = null, disabled = false, children = null}) => {
    return (
        <label className={`${styles.labelContainer} ${flexType === 'flex' ? styles.flex : styles.inlineFlex} ${className} ${disabled ? styles.disabled : ''}`}>
            <input
                type="checkbox"
                className={styles.input}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                name={name}
            />
            <span className={`${styles.checkmark} ${children && styles.marginRightDistance}`}></span>
            {children}
        </label>
    );
};

export default CustomCheckbox;

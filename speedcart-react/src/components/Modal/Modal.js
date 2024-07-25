// Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBackdrop} onClick={onClose} />
            <div className={styles.modalContent}>
                {typeof children === 'function' ? children({ closeModal: onClose }) : children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;

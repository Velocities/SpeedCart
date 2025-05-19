import React from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children, isCloseable = true }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBackdrop} onClick={onClose} />
            <div className={styles.modalContent}>
                {isCloseable &&
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                }
                {typeof children === 'function' ? children({ closeModal: onClose }) : children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;

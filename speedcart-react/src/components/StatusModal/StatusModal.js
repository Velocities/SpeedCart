// src/components/StatusModal.js
import React, { useEffect, useState } from 'react';
import styles from './StatusModal.module.css';
import { RequestStatus } from '@constants/enums.ts';

const StatusModal = ({ status, loadingText, successText, errorText }) => {
  const [animationClass, setAnimationClass] = useState(styles.slideUp);

  useEffect(() => {
    if (status !== RequestStatus.IDLE) {
      setAnimationClass(styles.slideDown);
    } else {
      // This is so the initial load of the component stays hidden
      setAnimationClass(styles.slideUp);
    }

    if (status === RequestStatus.SUCCESS || status === RequestStatus.ERROR) {
      const timer = setTimeout(() => {
        setAnimationClass(styles.slideUp);
      }, 4000); // Delay before starting slide up

      // Cleanup the timer if the component unmounts before the timeout
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderIcon = () => {
    switch (status) {
      case RequestStatus.LOADING:
        return <div className={styles.spinner}></div>;
      case RequestStatus.SUCCESS:
        return (
          <div className={styles.successCircle}>
            <svg
              viewBox="0 0 24 24"
              className={styles.checkmark}
            >
              <path
                fill="none"
                stroke="white"
                strokeWidth="2"
                d="M6 12l4 4 8-8"
              />
            </svg>
          </div>
        );
      case RequestStatus.ERROR:
        return <div className={styles.errorIcon}>❌</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.modalContainer} ${animationClass}`}>
      <div className={styles.modal}>
        {renderIcon()}
        <span className={styles.message}>
          {status === RequestStatus.LOADING ? loadingText : 
          status === RequestStatus.SUCCESS ? successText :
          status === RequestStatus.ERROR ? errorText :
          ''}
        </span>
      </div>
    </div>
  );
};

export default StatusModal;

// src/components/PageLayout.tsx
import React from 'react';
import StatusModal from '@components/StatusModal';

import styles from './PageLayout.module.css';

const PageLayout = ({ children, status = null, modalProps = null, className=''}) => {
  return (
    <>
      <main className={`${styles.mainContent} ${className}`}>
        {children}
      </main>
      {modalProps && <StatusModal status={status} {...modalProps} />}
    </>
  );
};

export default PageLayout;

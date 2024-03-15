// Footer.js
import React from 'react';
import styles from './Footer.module.css';

const Footer = (props) => {
  return (
    <footer className="centerText" id={props.id}>
      <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className={styles.rightWhiteBorder}>Terms of Service</a>
      <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
    </footer>
  );
};

export default Footer;

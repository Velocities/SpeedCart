import React from "react";
import styles from "./Footer.module.css";

const Footer = (props) => {
  return (
    <>
      <footer className={`${styles.footer}`} id={props.id}>
        <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className={styles.rightWhiteBorder}>
          Terms of Service
        </a>
        <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </footer>
      <span className={styles.reactAppVersion}>v{process.env.REACT_APP_VERSION}</span>
    </>
  );
};

export default Footer;

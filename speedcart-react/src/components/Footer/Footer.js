import React from "react";
import styles from "./Footer.module.css";

const Footer = (props) => {
  return (
    <>
      <footer className={`${styles.footer}`} id={props.id}>
        <span className={styles.footerLinks}>
          <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className={styles.rightWhiteBorder}>
            Terms of Service
          </a>
          <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </span>
        <span className={styles.reactAppVersion}>v{process.env.REACT_APP_VERSION}</span>
      </footer>
    </>
  );
};

export default Footer;

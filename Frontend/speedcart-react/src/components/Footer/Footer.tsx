import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = (props) => {
  return (
    <>
      <footer className={`${styles.footer}`} id={props.id}>
        <span className={styles.footerLinks}>
          <Link to="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className={styles.rightWhiteBorder}>
            Terms of Service
          </Link>
          <Link to="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
        </span>
        <span className={styles.reactAppVersion}>v{process.env.REACT_APP_VERSION}</span>
      </footer>
    </>
  );
};

export default Footer;

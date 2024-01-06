// src/components/Login.js
import React from 'react';
import styles from './css/Login.module.css';
import mainSiteStyles from './css/main.module.css';

function Login() {
  return (
    <div id="loginComponent" className={`${styles.loginContainer} ${mainSiteStyles.topElement}`}>
      <form id="loginForm">
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username:</label>
          <input name="username" className={`${styles.loginInputs} ${styles.input}`} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="login" className={styles.label}>Password:</label>
          <input name="login" type="password" className={`${styles.loginInputs} ${styles.input}`} />
        </div>
        <div id={styles.submitButtonContainer}>
          <input type="submit" value="Login" id={styles.submitButton} />
        </div>
      </form>
    </div>
  );
}

export default Login;

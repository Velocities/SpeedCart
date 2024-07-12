import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@customHooks/AuthContext';

import styles from './Login.module.css';

function Login() {
  const { isAuthenticated, login, logout} = useAuth();

  useEffect(() => {
    if ( isAuthenticated ) { 
      document.title = "Sign out of SpeedCart";
    } else {
      document.title = "Sign in to SpeedCart";
    }
  }, [isAuthenticated]);
  
  const handleLoginSuccess = (credentialResponse) => {
    // Handle the success of the Google login

    // Store the decoded token in localStorage
    const token = JSON.stringify(credentialResponse);
    login(token);

  };

  const handleLoginError = () => {
    // Handle login failure
    console.error('Login Failed');
  };

  return (
    <main className={`${styles.loginContainer} main-content`}>
      {isAuthenticated ? (
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      )}
    </main>
  );
}

export default Login;

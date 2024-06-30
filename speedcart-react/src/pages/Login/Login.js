import React, { useLayoutEffect, useEffect } from 'react';
import styles from './Login.module.css';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import layoutStyles from '../main.module.css'; // Import the new layout styles
import { useAuth } from '../../customHooks/AuthContext';

const debug = 0;

function Login() {
  const { isAuthenticated, login, logout} = useAuth();
  

  useLayoutEffect(() => {
    // Check if the user is already authenticated (e.g., stored in localStorage)
    const storedToken = localStorage.getItem('authToken');
    if (storedToken && debug) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(JSON.parse(storedToken).credential);
      console.log('User is already authenticated:', decodedToken);
    }
  }, []);

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
    <div className={`${styles.loginContainer} ${layoutStyles.fullHeightContainer}`}>
      {isAuthenticated ? (
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      )}
    </div>
  );
}

export default Login;

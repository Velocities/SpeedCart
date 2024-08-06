import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@customHooks/AuthContext';

import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
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
    // Redirect user to dashboard so they can see all of their shopping lists
    navigate('/dashboard');

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

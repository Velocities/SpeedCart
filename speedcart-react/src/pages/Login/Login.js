import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Necessary for redirects
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@customHooks/AuthContext';
import { RequestStatus } from '@constants/enums.ts';

import StatusModal from '@components/StatusModal';

import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(RequestStatus.IDLE);
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
    setLoginStatus(RequestStatus.LOADING);

    // Store the decoded token in localStorage
    const token = JSON.stringify(credentialResponse);
    login(token);
    setLoginStatus(RequestStatus.SUCCESS);
    // Redirect user to dashboard so they can see all of their shopping lists
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

  };

  const handleLoginError = () => {
    // Handle login failure
    console.error('Login Failed');
    setLoginStatus(RequestStatus.ERROR);
  };

  return (
    <>
      <main className={`${styles.loginContainer} main-content`}>
        {isAuthenticated ? (
          <>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </>
          
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        )}
      </main>
      <StatusModal status={loginStatus}
        loadingText='Verifying login token...'
        successText='Login successful! Redirecting to dashboard...'
        errorText='Login verification failed!'
      />
    </>
  );
}

export default Login;

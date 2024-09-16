import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Necessary for redirects
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from 'shared';
import { RequestStatus } from '@constants/enums.ts';
import { AppRoute } from '@constants/routes.ts';

import StatusModal from '@components/StatusModal';

import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginStatus, setLoginStatus] = useState(RequestStatus.IDLE);
  const [loginError, setLoginError] = useState(null);
  const { isAuthenticated, login, logout} = useAuth();
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || AppRoute.DASHBOARD;
  const redirectPageName = new URLSearchParams(location.search).get('redirectPageName') || 'dashboard';

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
    try {
      const token = JSON.stringify(credentialResponse);
      login(token);
      setLoginStatus(RequestStatus.SUCCESS);
      // Redirect user to dashboard so they can see all of their shopping lists
      setTimeout(() => {
        navigate(redirectUrl);
      }, 2000);
    } catch (errorText) {
      setLoginStatus(RequestStatus.ERROR);
      setLoginError(errorText);
    }
    

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
        successText={`Login successful! Redirecting to ${redirectPageName}...`}
        errorText={`Login verification failed! ${loginError}`}
      />
    </>
  );
}

export default Login;

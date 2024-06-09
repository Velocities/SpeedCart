import React, { useLayoutEffect, useEffect, useState } from 'react';
import styles from './Login.module.css';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import layoutStyles from '../main.module.css'; // Import the new layout styles

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useLayoutEffect(() => {
    // Check if the user is already authenticated (e.g., stored in localStorage)
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(JSON.parse(storedToken).credential);
      console.log('User is already authenticated:', decodedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    document.title = "Sign in to SpeedCart";
  }, []);
  
  const handleLoginSuccess = (credentialResponse) => {
    // Handle the success of the Google login
    //console.log(credentialResponse);

    // Decode the token
    //const decodedToken = jwtDecode(credentialResponse.credential);
    //console.log(decodedToken);

    // Store the decoded token in localStorage
    const token = JSON.stringify(credentialResponse);
    localStorage.setItem('authToken', token);
    //console.log("Login successful, token stored: ", localStorage.getItem('authToken'));
    setIsAuthenticated(true);
    //const token = JSON.stringify(credentialResponse);

    // Verify Google JWT with your backend
    fetch("https://api.speedcartapp.com/auth/google", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Add body if you're sending data with methods like POST
      // body: JSON.stringify(your_data_here),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response data here
        console.log(data);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const handleLoginError = () => {
    // Handle login failure
    console.log('Login Failed');
  };

  const handleLogout = () => {
    // Handle the success of the Google logout
    googleLogout();
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);

    // Perform additional logout actions if needed
    // ...
  };

  return (
    <div className={`${styles.loginContainer} ${layoutStyles.fullHeightContainer}`}>
      {isAuthenticated ? (
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
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

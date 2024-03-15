import React, { useLayoutEffect, useState } from 'react';
import styles from './Login.module.css';
import mainSiteStyles from '../main.module.css';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useLayoutEffect(() => {
    // Check if the user is already authenticated (e.g., stored in localStorage)
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(storedToken);
      console.log('User is already authenticated:', decodedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    // Handle the success of the Google login
    //console.log(credentialResponse);

    // Decode the token
    //const decodedToken = jwtDecode(credentialResponse.credential);
    //console.log(decodedToken);

    // Store the decoded token in localStorage
    localStorage.setItem('authToken', credentialResponse.credential);
    //console.log("Login successful, token stored: ", localStorage.getItem('authToken'));
    setIsAuthenticated(true);
    const token = JSON.stringify(credentialResponse);

    fetch("https://www.speedcartapp.com/api/authenticate.php", {
      method: "GET", // or "POST" or any other HTTP method
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust this header based on your API requirements
        // Add any other headers your API might require
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
    <div id="loginComponent" className={`${styles.loginContainer} ${mainSiteStyles.topElement}`}>
      {isAuthenticated ? (
        <button onClick={handleLogout} id={styles.logoutBtn}>Logout</button>
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

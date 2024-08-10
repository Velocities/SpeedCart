import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';

// Create the context
const AuthContext = createContext();
const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [userPicture, setUserPicture] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('speedcart_auth_exists');
        if (token) {
            setIsAuthenticated(true); 
            setUserPicture(localStorage.getItem('userImageUrl'));
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (token) => {
        const userInfo = jwtDecode(JSON.parse(token).credential);
        // Verify Google JWT with your backend
        fetch(`${baseUrl}/auth/google`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
        .then(response => {
            if (response.status === 200) {
                setIsAuthenticated(true);
                localStorage.setItem('speedcart_auth_exists', true);
                localStorage.setItem('userImageUrl', userInfo.picture);
            }
            return response.text();
        })
        .then(data => {
          // Handle the response data here
          //console.log("Response text: " + data);
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error);
        });
        setIsAuthenticated(true);
        setUserPicture(userInfo.picture);
    };

    const logout = () => {
        // Handle google's logout flow first
        googleLogout();

        fetch(`${baseUrl}/auth/google`, {
            method: "DELETE",
            credentials: 'include' // Include cookies in the request
            // No Bearer token necessary (cookie contains JWT that will be deleted on backend)
        })
        .then(() => {
            localStorage.removeItem('speedcart_auth_exists');
            localStorage.removeItem('userImageUrl');
            setIsAuthenticated(false);
            setUserPicture(null);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userPicture, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

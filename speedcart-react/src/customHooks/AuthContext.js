import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';

// Create the context
const AuthContext = createContext();
const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const userInfo = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
            setIsAuthenticated(true);
            setUser(userInfo);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        const userInfo = jwtDecode(JSON.parse(token).credential);
        // Verify Google JWT with your backend
        fetch(`${baseUrl}/auth/google`, {
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
          //console.log(data);
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error);
        });
        setIsAuthenticated(true);
        setUser(userInfo);
    };

    const logout = () => {
        // Handle google's logout flow first
        googleLogout();

        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

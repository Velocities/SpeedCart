import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import { BASE_URL } from '@constants';

// Create an interface for AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  userPicture: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Initialize the context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

interface GoogleToken {
  picture: string;
};


// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userPicture, setUserPicture] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("speedcart_auth_exists");
    if (token) {
      setIsAuthenticated(true);
      setUserPicture(localStorage.getItem("userImageUrl"));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string) => {
    const userInfo: GoogleToken = jwtDecode(JSON.parse(token).credential);
    // Initialize CSRF protection for the application

    fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include", // Important: include credentials to allow the cookie to be set
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
    }).then(csrfResponse => {
        console.log(`Response for CSRF token: ${csrfResponse.status} ${csrfResponse.statusText} and ${csrfResponse.type}`);// Get the CSRF token from cookies (document.cookies)
        //const csrfToken = getCookie("XSRF-TOKEN");
        //console.log(`csrf token retrieved: ${csrfToken}`);
        // Verify Google JWT with your backend
        fetch(`${BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: "include",
        }).then((response) => {
            //console.log(`Login response: ${JSON.stringify(response)}`);
            if (response.status === 200) {
              setIsAuthenticated(true);
              localStorage.setItem("speedcart_auth_bearer_token", token);
              localStorage.setItem("speedcart_auth_exists", 'true');
              localStorage.setItem("userImageUrl", userInfo.picture);
            }
            return response.json();
          })
          .then((data) => {
            // Handle the response data here
            console.log("Response text: " + JSON.stringify(data) + " and data token: " + JSON.stringify(data.token));
            localStorage.setItem("speedcart_auth_bearer_token", JSON.stringify(data.token));
          })
          .catch((error) => {
            // Handle errors here
            console.error("Error:", error);
          });
        setIsAuthenticated(true);
        setUserPicture(userInfo.picture);
      }
    );
    
  };

  const logout = () => {
    // Handle google's logout flow first
    googleLogout();

    fetch(`${BASE_URL}/auth/google`, {
      method: "DELETE",
      credentials: "include", // Include cookies in the request
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
      // No Bearer token necessary (cookie contains JWT that will be deleted on backend)
    })
      .then(() => {
        localStorage.removeItem("speedcart_auth_exists");
        localStorage.removeItem("userImageUrl");
        setIsAuthenticated(false);
        setUserPicture(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return <AuthContext.Provider value={{ isAuthenticated, userPicture, login, logout }}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the AuthContext
export const useAuth: any = () => useContext(AuthContext);
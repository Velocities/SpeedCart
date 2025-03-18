import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';
import { BASE_URL } from '@constants';
import { AuthContextType } from './AuthContextType';
import { GoogleToken, BackendFunction } from '@types';
// Initialize the context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userPictureLink, setUserPictureLink] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);  // State for tracking loading of other context states (necessary for page loads)

  useEffect(() => {
    const token = localStorage.getItem('speedcart_auth_exists');
    if (token === 'true') {
      setIsAuthenticated(true);
      setAuthToken(localStorage.getItem('speedcart_auth_token'));
      setUserPictureLink(localStorage.getItem('userImageUrl'));
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);  // Set loading to false after the status is determined
  }, []);

  const login = (token: string) => {
    const userInfo: GoogleToken = jwtDecode(JSON.parse(token).credential);
    // Initialize CSRF protection for the application

    fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include', // Important: include credentials to allow the cookie to be set
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }).then(csrfResponse => {
        console.log(`Response for CSRF token: ${csrfResponse.status} ${csrfResponse.statusText} and ${csrfResponse.type}`);// Get the CSRF token from cookies (document.cookies)
        //const csrfToken = getCookie('XSRF-TOKEN');
        //console.log(`csrf token retrieved: ${csrfToken}`);
        // Verify Google JWT with your backend
        fetch(`${BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            authMode: 'token', // Specify the auth mode here
          })
        }).then((response) => {
            //console.log(`Login response: ${JSON.stringify(response)}`);
            if (response.status === 200) {
              setIsAuthenticated(true);
              localStorage.setItem('speedcart_auth_bearer_token', token);
              localStorage.setItem('speedcart_auth_exists', 'true');
              localStorage.setItem('userImageUrl', userInfo.picture);
            }
            return response.json();
          })
          .then((data) => {
            // Handle the response data here
            //console.log('Response text: ' + JSON.stringify(data) + ' and data token: ' + JSON.stringify(data.token));
            localStorage.setItem('speedcart_auth_bearer_token', JSON.stringify(data.token));
            // Only needed for testing
            localStorage.setItem('speedcart_auth_token', data.token);
            setAuthToken(data.token);
          })
          .catch((error) => {
            // Handle errors here
            console.error('Error:', error);
          });
        setIsAuthenticated(true);
        setUserPictureLink(userInfo.picture);
      }
    );
    
  };

  const logout = () => {
    // Handle google's logout flow first
    googleLogout();

    fetch(`${BASE_URL}/auth/google`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies in the request
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // No Bearer token necessary (cookie contains JWT that will be deleted on backend)
    })
      .then(() => {
        localStorage.removeItem('speedcart_auth_exists');
        localStorage.removeItem('userImageUrl');
        setIsAuthenticated(false);
        setUserPictureLink(null);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Something like this, but we'd give stricter types and all share functions
  // would fit an interface for their input shape to normalize them all
  const callBackendAPI = async <TArgs, TResult>(
    endpointFunc: BackendFunction<TArgs, TResult>,
    args: TArgs
  ): Promise<TResult> => {
    // authToken is already managed by AuthProvider
    return endpointFunc(authToken, args);
  };  

  return <AuthContext.Provider value={{ isAuthenticated, loading, authToken, userPictureLink, login, logout, callBackendAPI }}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context: AuthContextType = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
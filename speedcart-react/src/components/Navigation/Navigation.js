// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useAuth } from '../../AuthContext';

function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav id={styles.navbar}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        {/* Add links to other pages here */}
        {isAuthenticated ? (
            <Link to="/login" id={styles.isLoggedIn} >
              <img src={user.picture} alt="Profile" />
            </Link>
          ) : (
            <Link to="/login" id={styles.loginBtn}>Login</Link>
        )}
    </nav>
  );
}

export default Navigation;
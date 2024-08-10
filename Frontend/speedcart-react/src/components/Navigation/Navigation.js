// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useAuth } from '@customHooks/AuthContext';

function Navigation() {
  const { isAuthenticated, userPicture } = useAuth();

  return (
    <nav className={styles.navbar}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        {/* Add links to other pages here */}
        {isAuthenticated ? (
            <Link to="/login" className={styles.isLoggedIn} >
              <img src={userPicture} alt="Profile" />
            </Link>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Login</Link>
        )}
    </nav>
  );
}

export default Navigation;
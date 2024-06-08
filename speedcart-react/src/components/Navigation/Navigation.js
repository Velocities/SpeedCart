// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

function Navigation() {
  return (
    <nav id={styles.navbar}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login" id={styles.loginBtn}>Login</Link>
        {/* Add links to other pages here */}
    </nav>
  );
}

export default Navigation;
// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav id="navbar">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login" id="loginBtn">Login</Link>
        {/* Add links to other pages here */}
    </nav>
  );
}

export default Navigation;
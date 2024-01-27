// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BodyClassSetter from './BodyClassSetter';
import ShoppingList from './components/ShoppingList';
import Footer from './components/Footer';
import './App.css';

function App() {
    return (
        <Router>
          <BodyClassSetter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home id="HomePage"/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/ShoppingList" element={<ShoppingList/>} />
                <Route path="/login" element={<Login />} />
            </Routes>
          </BodyClassSetter>
          <Footer id="policyFooter" />
        </Router>
    );
}

export default App;

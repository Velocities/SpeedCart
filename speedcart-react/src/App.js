// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@pages/Home';
import Navigation from '@components/Navigation';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import NewShoppingList from '@pages/NewShoppingList';
import ShoppingListDetail from '@pages/ShoppingListDetail';
import Footer from '@components/Footer';
import './App.css';
import ShoppingListShare from './pages/ShoppingListShare';

function App() {
    return (
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home id="HomePage"/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/NewShoppingList" element={<NewShoppingList/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/shopping-list/:id" element={<ShoppingListDetail />} />
            <Route path="/share/:token" element={<ShoppingListShare />} />
          </Routes>
          <Footer id="policyFooter" />
        </Router>
    );
}

export default App;

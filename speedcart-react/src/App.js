// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/Navigation';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard';
import BodyClassSetter from './BodyClassSetter';
import NewShoppingList from './components/NewShoppingList';
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
                <Route path="/NewShoppingList" element={<NewShoppingList/>} />
                <Route path="/login" element={<Login />} />
            </Routes>
          </BodyClassSetter>
          <Footer id="policyFooter" />
        </Router>
    );
}

export default App;

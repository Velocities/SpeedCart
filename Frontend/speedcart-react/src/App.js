// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from '@components/Navigation';
import Footer from '@components/Footer';
import Modal from '@components/Modal';

import { AppRoute } from '@constants/routes.ts';

import Home from '@pages/Home';
import ShoppingListShare from '@pages/ShoppingListShare';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import NewShoppingList from '@pages/NewShoppingList';
import ShoppingListDetail from '@pages/ShoppingListDetail';

import './App.css';
import TermsOfService from '@components/TermsOfService';

function App() {
  const [showToS, setShowToS] = useState(true);

  useEffect(() => {
    const hasAcceptedToS = localStorage.getItem('acceptedToS');
    if (hasAcceptedToS) {
      setShowToS(false);
    }
  }, []);

  const handleToSAccept = () => {
    localStorage.setItem('acceptedToS', true);
    setShowToS(false);
  };
  
  return (
        <Router>
          <Navigation />
          <Modal isOpen={showToS} isCloseable={false} >
            <TermsOfService onAccept={handleToSAccept} />
          </Modal>
          <Routes>
            <Route path={AppRoute.HOME} element={<Home id="HomePage"/>} />
            <Route path={AppRoute.DASHBOARD} element={<Dashboard/>} />
            <Route path={AppRoute.NEW_SHOPPING_LIST} element={<NewShoppingList/>} />
            <Route path={AppRoute.LOGIN} element={<Login />} />
            <Route path={`${AppRoute.SHOPPING_LIST_DETAIL}/:id`} element={<ShoppingListDetail />} />
            <Route path={`${AppRoute.SHOPPING_LIST_SHARE}/:token`} element={<ShoppingListShare />} />
          </Routes>
          <Footer id="policyFooter" />
        </Router>
    );
}

export default App;

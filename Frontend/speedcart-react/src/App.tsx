// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import PageLayout from '@components/PageLayout';
import Navigation from '@components/Navigation';
import Footer from '@components/Footer';
import Modal from '@components/Modal';
import SitePolicies from '@components/SitePolicies';

import { AppRoute } from '@constants/routes';

const Home = React.lazy(() => import('@pages/Home'));
const ShoppingListShare = React.lazy(() => import('@pages/ShoppingListShare'));
const Login = React.lazy(() => import('@pages/Login'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const NewShoppingListWithProvider = React.lazy(() => import('@pages/NewShoppingListWithProvider'));
const ShoppingListDetailWithProvider = React.lazy(() => import('@pages/ShoppingListDetailWithProvider'));

import './App.css';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [showSitePolicies, setShowSitePolicies] = useState(true);

  useEffect(() => {
    const hasAcceptedSitePolicies = localStorage.getItem('acceptedSitePolicies');
    if (hasAcceptedSitePolicies) {
      setShowSitePolicies(false);
    }
  }, []);

  const handleSitePoliciesAccept = () => {
    localStorage.setItem('acceptedSitePolicies', 'true');
    setShowSitePolicies(false);
  };
  
  return (
        <Router>
          <Navigation />
          <Modal isOpen={showSitePolicies} isCloseable={false} >
            <SitePolicies onAccept={handleSitePoliciesAccept} />
          </Modal>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => { /* reset state if needed */ }}>
            <React.Suspense fallback={<PageLayout>Loading...</PageLayout>}>
              <Routes>
                <Route path={AppRoute.HOME} element={<Home id="HomePage"/>} />
                <Route path={AppRoute.DASHBOARD} element={<Dashboard/>} />
                <Route path={AppRoute.NEW_SHOPPING_LIST} element={<NewShoppingListWithProvider/>} />
                <Route path={AppRoute.LOGIN} element={<Login />} />
                <Route path={`${AppRoute.SHOPPING_LIST_DETAIL}/:id`} element={<ShoppingListDetailWithProvider />} />
                <Route path={`${AppRoute.SHOPPING_LIST_SHARE}/:token`} element={<ShoppingListShare />} />
              </Routes>
            </React.Suspense>
          </ErrorBoundary>
          <Footer id="policyFooter" />
        </Router>
    );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductSelection from './components/ProductSelection';
import OrderList from './components/OrderList';
import StandbyScreen from './components/StandbyScreen';
import './App.css';

function Navigation({ isStandby, onBackToStandby, isNavVisible, toggleNav }) {
  const location = useLocation();

  if (isStandby) return null;

  return (
    <>
      {/* Toggle Button */}
      <button className="nav-toggle" onClick={toggleNav}>
        {isNavVisible ? '✕' : '☰'}
      </button>
      
      {/* Navigation Menu */}
      <motion.nav 
        className="navigation"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isNavVisible ? 0 : -100, 
          opacity: isNavVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ display: isNavVisible ? 'flex' : 'none' }}
      >
        <Link 
          to="/products" 
          className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          onClick={() => toggleNav()}
        >
          Products
        </Link>
        <Link 
          to="/orders" 
          className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
          onClick={() => toggleNav()}
        >
          Orders
        </Link>
        <button 
          className="nav-link" 
          onClick={() => {
            onBackToStandby();
            toggleNav();
          }}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          Back to Standby
        </button>
      </motion.nav>
    </>
  );
}

function App() {
  const [isStandby, setIsStandby] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(false);

  const handleStartOrdering = () => {
    setIsStandby(false);
  };

  const handleBackToStandby = () => {
    setIsStandby(true);
    setIsNavVisible(false);
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleOrderComplete = () => {
    setIsStandby(true);
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <Router>
        <div className="App">
          <AnimatePresence mode="wait">
            {isStandby ? (
              <motion.div
                key="standby"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <StandbyScreen onStartOrdering={handleStartOrdering} />
              </motion.div>
            ) : (
              <motion.div
                key="main-app"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <Navigation 
                  isStandby={isStandby} 
                  onBackToStandby={handleBackToStandby}
                  isNavVisible={isNavVisible}
                  toggleNav={toggleNav}
                />
                <main className="main-content">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ProductSelection 
                          onOrderComplete={handleOrderComplete}
                        />
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={
                        <ProductSelection 
                          onOrderComplete={handleOrderComplete}
                        />
                      } 
                    />
                    <Route path="/orders" element={<OrderList />} />
                  </Routes>
                </main>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;

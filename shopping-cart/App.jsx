import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import ProductList from './components/ProductList';
import CartItem from './components/CartItem';
import AboutUs from './components/AboutUs';

const App = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            🌿 Paradise Nursery
          </Link>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/plants">Plants</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/cart" className="cart-icon-container">
                🛒
                {totalItems > 0 && (
                  <span className="badge">{totalItems}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <div className="landing-page">
                <div className="hero-section">
                  <h1>🌿 Paradise Nursery</h1>
                  <p className="subtitle">
                    Bring nature home with our curated collection of houseplants
                  </p>
                  <Link to="/plants">
                    <button className="get-started-btn">Get Started</button>
                  </Link>
                </div>
              </div>
            }
          />

          {/* Product Listing */}
          <Route path="/plants" element={<ProductList />} />

          {/* About Us */}
          <Route path="/about" element={<AboutUs />} />

          {/* Cart */}
          <Route path="/cart" element={<CartItem />} />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

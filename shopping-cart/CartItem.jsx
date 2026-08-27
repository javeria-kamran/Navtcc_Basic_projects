import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectTotalAmount,
} from '../features/CartSlice';

const CartItem = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    alert('Coming Soon! Checkout functionality will be available in the next update.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add plants to your cart!</p>
          <Link to="/plants">
            <button className="continue-shopping-btn" style={{ marginTop: '1rem' }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Your Shopping Cart</h1>
        <span style={{ color: '#666' }}>
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80/4caf50/ffffff?text=🌿';
              }}
            />
            
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">
                Unit Price: ${item.price.toFixed(2)}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>

            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleDecrease(item.id)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleIncrease(item.id)}
              >
                +
              </button>
            </div>

            <button
              className="delete-btn"
              onClick={() => handleRemove(item.id)}
              title="Remove item"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          Total: ${totalAmount.toFixed(2)}
        </div>
        <div className="cart-actions">
          <Link to="/plants">
            <button className="continue-shopping-btn">
              Continue Shopping
            </button>
          </Link>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

import React, { useState, useEffect } from 'react';
import { createLoggedBus } from 'shared/eventBusLogger';
import './Cart.css';

const eventBus = createLoggedBus('mfe-cart');

function Cart() {
  const [items, setItems] = useState([]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const unsubscribeAdd = eventBus.on('cart:add', (product) => {
      setItems((prev) => [
        ...prev,
        { ...product, cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
      ]);
    });
    const unsubscribeClear = eventBus.on('cart:clear', () => {
      setItems([]);
    });
    return () => {
      unsubscribeAdd();
      unsubscribeClear();
    };
  }, []);

  useEffect(() => {
    eventBus.emit('cart:updated', {
      items,
      count: items.length,
      total: items.reduce((sum, item) => sum + item.price, 0),
    });
  }, [items]);

  const handleRemove = (cartId) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClear = () => {
    eventBus.emit('cart:clear', { timestamp: Date.now() });
  };

  return (
    <div className="cart">
      <h2>Panier ({items.length})</h2>
      {items.length === 0 ? (
        <p className="empty">Panier vide</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map(item => (
              <li key={item.cartId} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} EUR</span>
                <button className="remove-btn" onClick={() => handleRemove(item.cartId)}>x</button>
              </li>
            ))}
          </ul>
          <div className="cart-footer">
            <div className="cart-total">Total : {total} EUR</div>
            <button className="clear-btn" onClick={handleClear}>Vider le panier</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

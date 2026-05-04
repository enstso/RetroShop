import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
  const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:updated', ({ items }) => {
      if (!items || items.length === 0) {
        setRecos(PRODUCTS.slice(0, 3));
        return;
      }
      const cartIds = new Set(items.map((i) => i.id));
      const cartCategories = new Set(items.map((i) => i.category));
      const sameCategory = PRODUCTS.filter(
        (p) => cartCategories.has(p.category) && !cartIds.has(p.id)
      );
      const fillers = PRODUCTS.filter(
        (p) => !cartCategories.has(p.category) && !cartIds.has(p.id)
      );
      setRecos([...sameCategory, ...fillers].slice(0, 3));
    });
    return unsubscribe;
  }, []);

  const handleAddReco = (product) => {
    eventBus.emit('cart:add', product);
  };

  return (
    <div className="recommendations">
      <h2>Les joueurs achetent aussi</h2>
      <div className="reco-list">
        {recos.map(p => (
          <div key={p.id} className="reco-card" onClick={() => handleAddReco(p)}>
            <div className="reco-image" data-category={p.category}>{p.category}</div>
            <span className="reco-name">{p.name}</span>
            <span className="reco-price">{p.price} EUR</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;

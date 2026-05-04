import React, { useState, useEffect, Suspense, lazy } from 'react';
import eventBus from 'shared/eventBus';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

const ProductGrid = lazy(() =>
  import('mfeProduct/ProductGrid').catch(() => ({
    default: () => <div className="mfe-error">Catalogue indisponible.</div>,
  }))
);

const Cart = lazy(() =>
  import('mfeCart/Cart').catch(() => ({
    default: () => <div className="mfe-error">Panier indisponible.</div>,
  }))
);

const Recommendations = lazy(() =>
  import('mfeReco/Recommendations').catch(() => ({
    default: () => <div className="mfe-error">Recommandations indisponibles.</div>,
  }))
);

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:updated', ({ count }) => {
      setCartCount(count);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          <ErrorBoundary name="Products">
            <Suspense fallback={<LoadingFallback name="Products" />}>
              <ProductGrid />
            </Suspense>
          </ErrorBoundary>
        </section>
        <aside className="cart-area">
          <ErrorBoundary name="Cart">
            <Suspense fallback={<LoadingFallback name="Cart" />}>
              <Cart />
            </Suspense>
          </ErrorBoundary>
        </aside>
      </main>
      <section className="reco-area">
        <ErrorBoundary name="Recommendations">
          <Suspense fallback={<LoadingFallback name="Recommendations" />}>
            <Recommendations />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}

export default App;

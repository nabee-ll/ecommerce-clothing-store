import React, { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Back button component with hidden visibility
const BackButton: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'ArrowLeft') {
        window.history.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      onClick={() => window.history.back()}
      style={{ position: 'fixed', opacity: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      Back
    </button>
  );
};

const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  // Reset to home page if view is invalid
  useEffect(() => {
    if (!state.view || !['home', 'product', 'login', 'register', 'forgot-password', 'reset-password', 'cart', 'orders'].includes(state.view)) {
      dispatch({ type: 'SET_VIEW', payload: { view: 'home' } });
    }
  }, [state.view]);

  const renderView = () => {
    try {
      switch (state.view) {
        case 'home':
          return <HomePage />;
        case 'product':
          return <ProductDetailPage />;
        case 'login':
          return <LoginPage />;
        case 'register':
          return <RegisterPage />;
        case 'forgot-password':
          return <ForgotPasswordPage />;
        case 'reset-password':
          return <ResetPasswordPage />;
        case 'cart':
          return <CartPage />;
        case 'orders':
          return <OrderHistoryPage />;
        default:
          console.log('Invalid view state, defaulting to home');
          return <HomePage />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return <HomePage />;
    }
  };

  useEffect(() => {
    // Push the current view state to browser history
    const viewState = { view: state.view };
    window.history.pushState(viewState, '', window.location.pathname);

    // Handle browser back button
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        dispatch({ type: 'SET_VIEW', payload: event.state.view });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [state.view]);

  return (
    <div className="min-h-screen bg-background font-sans text-primary antialiased">
      <Navbar />
      <BackButton />
      <main className="p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
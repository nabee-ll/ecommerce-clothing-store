import React, { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

const App: React.FC = () => {
  const { state } = useContext(AppContext);

  const renderView = () => {
    switch (state.view) {
      case 'home':
        return <HomePage />;
      case 'product':
        return <ProductDetailPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'cart':
        return <CartPage />;
      case 'orders':
        return <OrderHistoryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-primary antialiased">
      <Navbar />
      <main className="p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
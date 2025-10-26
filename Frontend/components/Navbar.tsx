import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CartIcon, UserIcon, LogoutIcon, LoginIcon, OrderIcon } from './icons';

const Navbar: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { user, cart } = state;

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: { user: null, token: null } });
    dispatch({ type: 'SET_VIEW', payload: { view: 'home' } });
  };

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'home' } })}
              className="text-primary font-bold text-3xl tracking-widest"
            >
              LUXE
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'cart' } })}
              className="relative text-secondary hover:text-primary transition-colors duration-300"
            >
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            {user ? (
              <>
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'orders' } })}
                  className="text-secondary hover:text-primary transition-colors duration-300 hidden md:block"
                  title="My Orders"
                >
                  <OrderIcon />
                </button>
                <div className="flex items-center space-x-2 text-secondary">
                  <span className="hidden sm:inline">{user.username}</span>
                  <UserIcon />
                </div>
                <button onClick={handleLogout} className="text-secondary hover:text-primary transition-colors duration-300" title="Logout">
                  <LogoutIcon />
                </button>
              </>
            ) : (
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'login' } })}
                className="text-secondary hover:text-primary transition-colors duration-300 flex items-center space-x-2"
              >
                <LoginIcon />
                <span className="hidden md:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
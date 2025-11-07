import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CartIcon, UserIcon, LogoutIcon, LoginIcon, OrderIcon } from './icons';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { user, cart } = state;

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: { user: null, token: null } });
    dispatch({ type: 'SET_VIEW', payload: { view: 'home' } });
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b border-border">
      <div className="bg-cream text-primary text-sm py-2 text-center font-serif">
        Free Worldwide Shipping on Orders Over ₹1000
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-12">
            <button
              className="text-primary font-serif text-4xl tracking-widest hover:text-accent transition-colors duration-300"
              onClick={() => {
                dispatch({ type: 'SET_FILTER_OPTIONS', payload: {
                  categories: [],
                  sortBy: null,
                  priceRange: { min: 0, max: 1000000 }
                }});
                dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
                dispatch({ type: 'SET_VIEW', payload: { view: 'home' } });
              }}
            >
              NOIR
            </button>
            <div className="hidden md:flex space-x-8 text-sm tracking-wide">
              <button 
                onClick={() => {
                  dispatch({ 
                    type: 'SET_VIEW', 
                    payload: { view: 'category' }
                  });
                  dispatch({
                    type: 'SET_FILTER_OPTIONS',
                    payload: {
                      categories: [],
                      sortBy: 'newest'
                    }
                  });
                }} 
                className="text-primary hover:text-gold transition-colors duration-300 relative group"
              >
                NEW ARRIVALS
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"/>
              </button>
              <button 
                onClick={() => {
                  dispatch({ 
                    type: 'SET_VIEW', 
                    payload: { view: 'category' }
                  });
                  dispatch({
                    type: 'SET_FILTER_OPTIONS',
                    payload: {
                      categories: ["Women's"],
                      sortBy: null
                    }
                  });
                }}
                className="text-primary hover:text-gold transition-colors duration-300 relative group"
              >
                WOMEN
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"/>
              </button>
              <button 
                onClick={() => {
                  dispatch({ 
                    type: 'SET_VIEW', 
                    payload: { view: 'category' }
                  });
                  dispatch({
                    type: 'SET_FILTER_OPTIONS',
                    payload: {
                      categories: ["Men's"],
                      sortBy: null
                    }
                  });
                }}
                className="text-primary hover:text-gold transition-colors duration-300 relative group"
              >
                MEN
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"/>
              </button>
              <button 
                onClick={() => {
                  dispatch({ 
                    type: 'SET_VIEW', 
                    payload: { view: 'category' }
                  });
                  dispatch({
                    type: 'SET_FILTER_OPTIONS',
                    payload: {
                      categories: ['Accessories'],
                      sortBy: null
                    }
                  });
                }}
                className="text-primary hover:text-gold transition-colors duration-300 relative group"
              >
                ACCESSORIES
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"/>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <SearchBar />
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
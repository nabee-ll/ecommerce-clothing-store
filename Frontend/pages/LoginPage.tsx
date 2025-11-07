import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

const LoginPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  
  useEffect(() => {
    console.log('Current view:', state.view);
  }, [state.view]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!validatePassword(password)) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await api.loginUser({ username, password });
      dispatch({ type: 'SET_USER', payload: { user: data.user, token: data.access_token } });
      // If there's a product waiting to be added to cart, add it after login
      const pendingProduct = localStorage.getItem('pendingCartProduct');
      if (pendingProduct) {
        dispatch({ type: 'ADD_TO_CART', payload: JSON.parse(pendingProduct) });
        localStorage.removeItem('pendingCartProduct');
        dispatch({ type: 'SET_VIEW', payload: { view: 'cart' } });
      } else {
        dispatch({ type: 'SET_VIEW', payload: { view: 'home' } });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-sm bg-surface p-8 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <h2 className="text-3xl font-bold text-center text-primary mb-8 tracking-tight">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border border-border rounded-lg w-full py-2.5 px-3 text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border border-border rounded-lg w-full py-2.5 px-3 text-primary mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: { view: 'forgot-password' } });
                console.log('Navigating to forgot password page'); // Debug log
              }}
              className="inline-block align-baseline font-bold text-sm text-accent hover:text-accent-dark"
            >
              Forgot Password?
            </button>
          </div>
          <p className="text-center text-secondary text-sm mt-8">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'register' } })}
              className="font-semibold text-accent hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
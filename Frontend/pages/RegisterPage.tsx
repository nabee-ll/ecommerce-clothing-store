import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

const RegisterPage: React.FC = () => {
  const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate username
      if (!username) {
        setError("Username is required.");
        return;
      }
      if (username.length > 50) {
        setError("Username must be less than 50 characters.");
        return;
      }
      if (username.includes(" ")) {
        setError("Username cannot contain spaces.");
        return;
      }

      // Validate email
      if (!email) {
        setError("Email is required.");
        return;
      }
      if (email.length > 100) {
        setError("Email must be less than 100 characters.");
        return;
      }
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Validate password
      if (!password) {
        setError("Password is required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password.length > 255) {
        setError("Password is too long.");
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Attempt registration
      const result = await api.registerUser({ username: username.trim(), email: email.trim(), password });
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        dispatch({ type: 'SET_VIEW', payload: { view: 'login' } });
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    try {
      await api.registerUser({ username, email, password });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        dispatch({ type: 'SET_VIEW', payload: { view: 'login' } });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-sm bg-surface p-8 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <h2 className="text-3xl font-bold text-center text-primary mb-8 tracking-tight">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={50}
              pattern="[^\s]+"
              title="Username cannot contain spaces"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter username (max 50 characters)"
            />
            <p className="mt-1 text-xs text-gray-500">Username must be unique and cannot contain spaces</p>
          </div>

          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your email address"
            />
            <p className="mt-1 text-xs text-gray-500">Enter a valid email address</p>
          </div>

          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              maxLength={255}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-5">
            <label className="block text-secondary text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              className="bg-accent hover:bg-blue-600/90 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:shadow-outline transition w-full disabled:bg-gray-300"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
          <p className="text-center text-secondary text-sm mt-8">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: { view: 'login' } })}
              className="font-semibold text-accent hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
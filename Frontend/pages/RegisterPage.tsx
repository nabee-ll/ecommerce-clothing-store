import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

const RegisterPage: React.FC = () => {
  const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.registerUser({ username, password });
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
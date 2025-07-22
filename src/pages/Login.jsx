import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white font-bold">🔒</span>
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">Fetan Admin</h1>
          <p className="text-xl text-gray-600">Welcome Back</p>
          <p className="text-gray-500">Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Fetan Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
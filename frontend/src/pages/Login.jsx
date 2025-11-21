import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, reset } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    // Check if user is trying to access a protected route
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');
    
    if (redirect && !redirect.startsWith('/admin')) {
      setLocationError('Please login to access that page');
    }
    
    if (isSuccess && user) {
      // Redirect based on user role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        // If there's a redirect parameter, use it
        if (redirect && !redirect.startsWith('/admin')) {
          navigate(redirect);
        } else {
          navigate('/dashboard');
        }
      }
      dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch, location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // Determine error message
  let error = '';
  if (isError) {
    error = message;
  }

  // Show loading state
  const loading = isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-3xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Login
          </h2>
          <p className="mt-4 text-center text-xl text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {(error || locationError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl relative" role="alert">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="block sm:inline text-lg">{error || locationError}</span>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="rounded-2xl shadow-lg -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-2xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-lg"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-2xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-lg"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-lg">
              <Link to="/forgot-password" className="font-bold text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 text-lg">
            Don't have an account? Sign up
          </Link>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/admin/login" className="font-bold text-gray-600 hover:text-gray-900 text-lg">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showServerStartup, setShowServerStartup] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds = 1 minute
  const router = useRouter();
  const { login } = useAuth();

  // Check if we need to show server startup notification
  const shouldShowStartupNotification = () => {
    const lastServerStartupTime = localStorage.getItem('lastServerStartupTime');
    if (!lastServerStartupTime) {
      return true;
    }
    
    const threeMinutesInMs = 3 * 60 * 1000;
    const lastTime = parseInt(lastServerStartupTime);
    const currentTime = new Date().getTime();
    
    // Show notification only if 3 minutes have passed since the last one
    return (currentTime - lastTime) > threeMinutesInMs;
  };

  // Timer effect for countdown (only for visual display)
  useEffect(() => {
    let timer;
    if (showServerStartup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Reset countdown for next time, but don't hide notification
      setCountdown(60);
    }
    return () => {
      clearInterval(timer);
    };
  }, [showServerStartup, countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if we need to show the server startup notification
    const shouldShowNotification = shouldShowStartupNotification();
    
    if (shouldShowNotification) {
      setShowServerStartup(true);
    }

    try {
      // Send the login request (this will take ~1 minute if server is cold starting)
      await login(formData);
      
      router.push('/dashboard');
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
      // If we showed the notification, hide it and update timestamp
      if (shouldShowNotification) {
        setShowServerStartup(false);
        setCountdown(60);
        localStorage.setItem('lastServerStartupTime', new Date().getTime().toString());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Server startup notification overlay */}
      {showServerStartup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Server is starting up...</h3>
            <p className="mb-6 text-gray-600">
              Our backend server is waking up from sleep. This process typically takes about 1 minute.
              Your login request is being processed in the background.
            </p>
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((60 - countdown) / 60) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              This is only required when our server has been inactive.
            </p>
          </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={showServerStartup}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={showServerStartup}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || (showServerStartup && countdown > 0)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
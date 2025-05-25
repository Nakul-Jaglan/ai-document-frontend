import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-800">
                Document Portal
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <a
                href="https://github.com/yourusername/document-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                GitHub
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {user.username || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                About This Project
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="prose">
              <p className="text-gray-600 mb-4">
                This Document Portal allows users to upload and manage their
                documents, and leverages AI to answer questions about PDF
                documents using the Gemini API.
              </p>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Features:
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Secure document upload and management</li>
                <li>AI-powered document analysis</li>
                <li>Question answering for PDF documents</li>
                <li>JWT authentication</li>
              </ul>
              <p className="text-gray-600">Created by Nakul</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
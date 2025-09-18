'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '../../../../lib/useApi';
import Navbar from '../../../../components/Navbar';
import PrivateRoute from '../../../../components/PrivateRoute';
import FormattedAnswer from '../../../../components/FormattedAnswer';

const DocumentQuestion = () => {
  const { documents } = useApi();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [document, setDocument] = useState(null);
  const [history, setHistory] = useState([]); // To store question-answer pairs
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await documents.getById(id);
        setDocument(response.data);
      } catch (error) {
        setError('Failed to fetch document details');
      }
    };
    fetchDocument();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await documents.askQuestion(id, question);
      const newAnswer = response.data.answer;
      setAnswer(newAnswer);
      setHistory((prevHistory) => [...prevHistory, { question, answer: newAnswer }]);
      setQuestion(''); // Clear the question input after submission
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to get answer. Please try again.';
      setError(errorMessage);
      if (error.response?.status === 401) {
        setError('API authentication failed. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-20">
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {document && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h1>
              <p className="text-gray-600">{document.description}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question about this document..."
                  className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              {question &&
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Getting Answer...' : 'Ask Question'}
                </button>
              }
              {!question &&
                <button
                  type="submit"
                  disabled={true}
                  className="w-full bg-blue-600 cursor-not-allowed text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Getting Answer...' : 'Ask Question'}
                </button>
              }
            </form>

            {error && (
              <div className="mt-4 text-red-600 text-sm">{error}</div>
            )}

            {answer && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Answer:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <FormattedAnswer answer={answer} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversation History</h2>
            {history.length === 0 ? (
              <p className="text-gray-600">No questions asked yet.</p>
            ) : (
              <ul className="space-y-6">
                {history.map((entry, index) => (
                  <li key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="text-lg font-medium text-blue-600">Question:</span>
                      <p className="text-gray-800 mt-1">{entry.question}</p>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-green-600">Answer:</span>
                      <div className="mt-2">
                        <FormattedAnswer answer={entry.answer} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default DocumentQuestion;
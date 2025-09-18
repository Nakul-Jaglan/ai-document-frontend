'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

const DocumentCard = ({ document, onDelete, onUpdate }) => {
  const router = useRouter();

  const [deleteModal, setDeleteModal] = React.useState(false);

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    router.push(`/document/${document.id}/question`);
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate(document);
  };

  const handleDelete = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    onDelete(document.id);
  };

  const handleAskQuestions = (e) => {
    e.stopPropagation();
    router.push(`/document/${document.id}/question`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" >
      <div className="p-6" onClick={handleCardClick}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {document.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Uploaded on {formatDate(document.uploaded_at)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">{document.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {document.file_type.toUpperCase()}
            </span>
            <div className="flex space-x-3">
              {document.file_type === 'pdf' && (
                <button
                  onClick={handleAskQuestions}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Ask Questions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {deleteModal && 
        <div className="fixed inset-0 cursor-default bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-400 cursor-pointer hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-4">Are you sure you want to delete the document "<span className="font-semibold">{document.title}</span>"? This action cannot be undone.</p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  handleDelete(e); 
                  setDeleteModal(false); 
                }}
                className="flex-1 cursor-pointer px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default DocumentCard;
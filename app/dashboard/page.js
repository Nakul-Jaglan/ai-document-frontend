'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '../../lib/useApi';
import DocumentCard from '../../components/DocumentCard';
import UploadModal from '../../components/UploadModal';
import UpdateModal from '../../components/UpdateModal';
import Navbar from '../../components/Navbar';
import PrivateRoute from '../../components/PrivateRoute';

const Dashboard = () => {
  const { documents } = useApi();
  const [documentsList, setDocumentsList] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const response = await documents.getAll();
      setDocumentsList(response.data);
    } catch (error) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (formData) => {
    try {
      await documents.upload(formData);
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await documents.delete(id);
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async (document) => {
    setSelectedDocument(document);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (id, updateData) => {
    try {
      await documents.update(id, updateData);
      fetchDocuments(); // Refresh the documents list
      setIsUpdateModalOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Update error:', error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">My Documents</h1>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-2 md:px-4 py-2 text-sm cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload Document
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : documentsList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {documentsList.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />

        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedDocument(null);
          }}
          onUpdate={handleUpdateSubmit}
          document={selectedDocument}
        />
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;
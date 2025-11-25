'use client';

import { useState } from 'react';
import { deleteLink } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

export default function LinkTable({ links, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCode, setDeletingCode] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'error' });
  const router = useRouter();

  const filteredLinks = links.filter(link => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(searchLower) ||
      link.target_url.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteClick = (code) => {
    setLinkToDelete(code);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;

    setDeletingCode(linkToDelete);
    setShowDeleteModal(false);
    
    try {
      await deleteLink(linkToDelete);
      if (onDelete) {
        onDelete();
      }
      setToast({ isOpen: true, message: 'Link deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ isOpen: true, message: error.message || 'Failed to delete link', type: 'error' });
    } finally {
      setDeletingCode(null);
      setLinkToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLinkToDelete(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ isOpen: true, message: 'Copied to clipboard!', type: 'success' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getShortUrl = (code) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return `${baseUrl}/${code}`;
  };

  if (links.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message="Are you sure you want to delete this link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400 cursor-text"
            />
          </div>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total Clicks
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                Last Clicked
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="font-medium">No links match your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.code} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(getShortUrl(link.code))}
                        className="text-blue-600 hover:text-blue-800 font-mono text-sm font-semibold hover:underline cursor-pointer"
                        title="Click to copy"
                      >
                        {link.code}
                      </button>
                      <button
                        onClick={() => copyToClipboard(getShortUrl(link.code))}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 cursor-pointer"
                        title="Copy"
                        aria-label="Copy short URL"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2 max-w-md">
                      <span className="text-sm text-gray-900 truncate" title={link.target_url}>
                        {truncateUrl(link.target_url, 50)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.target_url)}
                        className="text-gray-400 hover:text-blue-600 flex-shrink-0 transition-colors p-1 rounded hover:bg-blue-50 cursor-pointer"
                        title="Copy URL"
                        aria-label="Copy target URL"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {link.total_clicks || 0}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                    {formatDate(link.last_clicked_at)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => router.push(`/code/${link.code}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-left sm:text-center transition-colors cursor-pointer"
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => handleDeleteClick(link.code)}
                        disabled={deletingCode === link.code}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed text-left sm:text-center font-semibold hover:underline transition-colors cursor-pointer"
                      >
                        {deletingCode === link.code ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}


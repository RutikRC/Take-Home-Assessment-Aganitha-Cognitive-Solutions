'use client';

import { useState } from 'react';
import { deleteLink } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LinkTable({ links, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCode, setDeletingCode] = useState(null);
  const router = useRouter();

  const filteredLinks = links.filter(link => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(searchLower) ||
      link.target_url.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeletingCode(code);
    try {
      await deleteLink(code);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      alert(error.message || 'Failed to delete link');
    } finally {
      setDeletingCode(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Clicks
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Last Clicked
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No links match your search
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.code} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(getShortUrl(link.code))}
                        className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                        title="Click to copy"
                      >
                        {link.code}
                      </button>
                      <button
                        onClick={() => copyToClipboard(getShortUrl(link.code))}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy"
                        aria-label="Copy short URL"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900" title={link.target_url}>
                        {truncateUrl(link.target_url, 40)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.target_url)}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        title="Copy URL"
                        aria-label="Copy target URL"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.total_clicks || 0}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {formatDate(link.last_clicked_at)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => router.push(`/code/${link.code}`)}
                        className="text-blue-600 hover:text-blue-900 text-left sm:text-center"
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => handleDelete(link.code)}
                        disabled={deletingCode === link.code}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed text-left sm:text-center"
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
  );
}


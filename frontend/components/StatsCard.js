'use client';

import { useState } from 'react';
import Toast from './Toast';

export default function StatsCard({ link }) {
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getShortUrl = (code) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${baseUrl}/${code}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ isOpen: true, message: 'Copied to clipboard!', type: 'success' });
  };

  if (!link) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <div className="p-3 bg-blue-100 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-l-4 border-blue-500">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Short Code</label>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-blue-600">{link.code}</span>
            <button
              onClick={() => copyToClipboard(getShortUrl(link.code))}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded hover:bg-white cursor-pointer"
              title="Copy short URL"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Target URL</label>
          <div className="flex items-start gap-3">
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all font-medium hover:underline flex-1 cursor-pointer"
            >
              {link.target_url}
            </a>
            <button
              onClick={() => copyToClipboard(link.target_url)}
              className="text-gray-400 hover:text-blue-600 flex-shrink-0 transition-colors p-2 rounded hover:bg-white cursor-pointer"
              title="Copy URL"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-2 block">Total Clicks</label>
            <p className="text-4xl font-bold">{link.total_clicks || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Last Clicked</label>
            <p className="text-lg font-semibold text-gray-900">{formatDate(link.last_clicked_at)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Created At</label>
            <p className="text-lg font-semibold text-gray-900">{formatDate(link.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


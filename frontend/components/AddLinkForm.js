'use client';

import { useState } from 'react';
import { createLink } from '@/lib/api';

export default function AddLinkForm({ onLinkCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateCode = (codeString) => {
    if (!codeString) return true; // Optional
    return /^[A-Za-z0-9]{6,8}$/.test(codeString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL with http:// or https://');
      return;
    }

    if (code && !validateCode(code)) {
      setError('Code must be 6-8 alphanumeric characters');
      return;
    }

    setLoading(true);

    try {
      await createLink(url, code || null);
      setSuccess(true);
      setUrl('');
      setCode('');
      if (onLinkCreated) {
        onLinkCreated();
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Short Link</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.example.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Code <span className="text-gray-500 font-normal">(optional, 6-8 characters)</span>
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Leave empty for auto-generated"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            disabled={loading}
            maxLength={8}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg animate-slide-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-r-lg animate-slide-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Link created successfully!</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {loading && (
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          )}
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </div>
    </form>
  );
}


'use client';

import { useState, useEffect } from 'react';
import AddLinkForm from '@/components/AddLinkForm';
import LinkTable from '@/components/LinkTable';
import { getLinks } from '@/lib/api';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TinyLink
              </h1>
              <p className="text-gray-600 mt-1 text-sm">URL Shortener & Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AddLinkForm onLinkCreated={fetchLinks} />

        {loading ? (
          <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading links...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-400">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 font-medium mb-2">{error}</p>
                <button
                  onClick={fetchLinks}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline hover:no-underline transition-colors cursor-pointer"
                >
                  Try again →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <LinkTable links={links} onDelete={fetchLinks} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          <p>© 2024 TinyLink - URL Shortener</p>
        </div>
      </footer>
    </div>
  );
}

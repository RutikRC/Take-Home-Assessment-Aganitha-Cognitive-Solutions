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
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
          <p className="text-gray-600 mt-1">URL Shortener & Analytics</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddLinkForm onLinkCreated={fetchLinks} />

        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading links...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={fetchLinks}
              className="mt-2 text-sm underline hover:no-underline block"
            >
              Try again
            </button>
          </div>
        ) : (
          <LinkTable links={links} onDelete={fetchLinks} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600 text-sm">
          <p>TinyLink - URL Shortener</p>
        </div>
      </footer>
    </div>
  );
}

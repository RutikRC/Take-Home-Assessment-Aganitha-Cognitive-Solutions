'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatsCard from '@/components/StatsCard';
import { getLinkStats } from '@/lib/api';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getLinkStats(code);
        setLink(data);
      } catch (err) {
        setError(err.message || 'Failed to load link stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
              <p className="text-gray-600 mt-1">Link Statistics</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading statistics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={() => router.push('/')}
              className="mt-2 block text-sm underline hover:no-underline"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <StatsCard link={link} />
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


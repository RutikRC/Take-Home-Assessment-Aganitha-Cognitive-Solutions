'use client';

export default function StatsCard({ link }) {
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
  };

  if (!link) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Link Statistics</h1>
      
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-500">Short Code</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-mono text-blue-600">{link.code}</span>
            <button
              onClick={() => copyToClipboard(getShortUrl(link.code))}
              className="text-gray-400 hover:text-gray-600"
              title="Copy short URL"
            >
              📋
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-500">Target URL</label>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {link.target_url}
            </a>
            <button
              onClick={() => copyToClipboard(link.target_url)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              title="Copy URL"
            >
              📋
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-500">Total Clicks</label>
          <p className="mt-1 text-2xl font-bold text-gray-900">{link.total_clicks || 0}</p>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-medium text-gray-500">Last Clicked</label>
          <p className="mt-1 text-gray-900">{formatDate(link.last_clicked_at)}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Created At</label>
          <p className="mt-1 text-gray-900">{formatDate(link.created_at)}</p>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

interface NoindexResult {
  hasNoindexMeta: boolean;
  hasNoindexRobots: boolean;
  robotsTxtContent?: string;
  metaTags: string[];
  url: string;
}

const tooltips = {
  metaTags: (
    <div>
      <p className="font-semibold mb-1">Meta Tags</p>
      <p>Meta tags are HTML elements that provide information about a webpage to search engines and browsers. The <code>noindex</code> meta tag tells search engines not to index the page.</p>
      <p className="mt-2 text-xs text-gray-500">Example: <code>&lt;meta name="robots" content="noindex"&gt;</code></p>
    </div>
  ),
  robotsTxt: (
    <div>
      <p className="font-semibold mb-1">Robots.txt</p>
      <p>The robots.txt file is a text file that tells search engines which pages they can or cannot crawl. A <code>noindex</code> directive in robots.txt prevents indexing of specified pages.</p>
      <p className="mt-2 text-xs text-gray-500">Example: <code>Disallow: /private/</code></p>
    </div>
  ),
  implications: (
    <div>
      <p className="font-semibold mb-1">What This Means</p>
      <p>If noindex is found, search engines will not include these pages in their search results. This is useful for:</p>
      <ul className="list-disc list-inside mt-1 text-xs">
        <li>Private or internal pages</li>
        <li>Duplicate content</li>
        <li>Development/staging pages</li>
        <li>Pages with sensitive information</li>
      </ul>
    </div>
  ),
  metaTagList: (
    <div>
      <p className="font-semibold mb-1">Found Meta Tags</p>
      <p>These are the meta tags found on your page. Look for tags containing "robots" or "noindex" to see if indexing is blocked.</p>
    </div>
  ),
  robotsContent: (
    <div>
      <p className="font-semibold mb-1">Robots.txt Content</p>
      <p>This is the content of your robots.txt file. It shows which pages search engines are allowed or disallowed from crawling.</p>
    </div>
  )
};

export default function NoindexChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NoindexResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/noindex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: url }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check noindex status');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Noindex Checker</h2>
        <Tooltip content={tooltips.implications} icon />
      </div>
      <p className="text-gray-600 mb-6">
        Check if your website is properly configured for search engine indexing by verifying meta tags and robots.txt settings.
      </p>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., example.com)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !url}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">Meta Tags Check</h3>
                <Tooltip content={tooltips.metaTags} icon />
              </div>
              <div className="flex items-center gap-2">
                {result.hasNoindexMeta ? (
                  <>
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                    <span className="text-red-600">Noindex meta tag found</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-green-600">No noindex meta tag found</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">Robots.txt Check</h3>
                <Tooltip content={tooltips.robotsTxt} icon />
              </div>
              <div className="flex items-center gap-2">
                {result.hasNoindexRobots ? (
                  <>
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                    <span className="text-red-600">Noindex directive found in robots.txt</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-green-600">No noindex directive in robots.txt</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {result.metaTags.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">Found Meta Tags</h3>
                <Tooltip content={tooltips.metaTagList} icon />
              </div>
              <div className="space-y-2">
                {result.metaTags.map((tag, index) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.robotsTxtContent && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">Robots.txt Content</h3>
                <Tooltip content={tooltips.robotsContent} icon />
              </div>
              <pre className="text-sm font-mono bg-white p-4 rounded overflow-x-auto">
                {result.robotsTxtContent}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
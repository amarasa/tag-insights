"use client";

import { useState, useEffect, useRef } from "react";

// SVG icons
const LogoIcon = (
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mr-2">
    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 12h8M12 8v8" strokeWidth="2" strokeLinecap="round" /></svg>
  </span>
);
const GTMIcon = (
  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" strokeLinecap="round" /></svg>
  </span>
);
const GAIcon = (
  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 18v-2a4 4 0 014-4h8a4 4 0 014 4v2" strokeWidth="2" /><circle cx="12" cy="8" r="4" strokeWidth="2" /></svg>
  </span>
);
const EmptyIcon = (
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M9 12h6M12 9v6" strokeWidth="2" strokeLinecap="round" /></svg>
  </span>
);
const InfoIcon = (
  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" /></svg>
);

// Other tag icons
const otherTagIcons: Record<string, React.ReactNode> = {
  facebook: <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  hotjar: <svg className="w-5 h-5 text-[#ea4e2c]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  linkedin: <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.601 2.001 3.601 4.601v5.595z"/></svg>,
  clarity: <svg className="w-5 h-5 text-[#5c2d91]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>,
  twitter: <svg className="w-5 h-5 text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg>,
  pinterest: <svg className="w-5 h-5 text-[#e60023]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.396 7.627 11.093-.105-.943-.2-2.393.042-3.425.219-.963 1.408-6.137 1.408-6.137s-.359-.719-.359-1.781c0-1.668.968-2.915 2.172-2.915 1.025 0 1.52.77 1.52 1.693 0 1.032-.657 2.574-.995 4.011-.283 1.2.601 2.178 1.782 2.178 2.138 0 3.782-2.254 3.782-5.506 0-2.877-2.07-4.892-5.03-4.892-3.432 0-5.444 2.573-5.444 5.232 0 1.033.398 2.143.895 2.744.099.12.113.225.083.346-.09.354-.292 1.125-.332 1.282-.05.2-.162.242-.375.146-1.398-.573-2.27-2.37-2.27-3.818 0-3.108 2.257-6.684 6.74-6.684 3.537 0 6.287 2.522 6.287 5.892 0 3.513-2.211 6.142-5.282 6.142-1.057 0-2.052-.55-2.39-1.188l-.65 2.474c-.197.755-.728 1.701-1.085 2.277C8.7 22.93 10.32 23.25 12 23.25c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>,
  tiktok: <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 2v12.25a2.75 2.75 0 11-2.75-2.75h.25"/></svg>,
};

const otherTagDefs = [
  { key: "facebook", label: "Facebook Pixel", test: (html: string) => /fbq\(|facebook\.com\/tr\?id=/.test(html) },
  { key: "hotjar", label: "Hotjar", test: (html: string) => /hotjar\.com|_hjSettings/.test(html) },
  { key: "linkedin", label: "LinkedIn Insight", test: (html: string) => /snap\.licdn\.com|linkedin\.com\/insight/.test(html) },
  { key: "clarity", label: "Microsoft Clarity", test: (html: string) => /clarity\.ms|clarity\s*\(/.test(html) },
  { key: "twitter", label: "Twitter Pixel", test: (html: string) => /analytics\.twitter\.com|twq\s*\(/.test(html) },
  { key: "pinterest", label: "Pinterest Tag", test: (html: string) => /ct\.pinterest\.com|pintrk\s*\(/.test(html) },
  { key: "tiktok", label: "TikTok Pixel", test: (html: string) => /tiktok\.com\/pixel|ttq\s*\(/.test(html) },
];

export default function Home() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { gtm: string[]; ga: string[]; error?: string; html?: string }>(null);
  const [otherTags, setOtherTags] = useState<{ key: string; label: string }[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const h = localStorage.getItem("taginsights-history");
    if (h) setHistory(JSON.parse(h));
  }, []);

  // Save to history
  const saveToHistory = (domain: string) => {
    setHistory(prev => {
      const filtered = [domain, ...prev.filter(d => d !== domain)].slice(0, 8);
      localStorage.setItem("taginsights-history", JSON.stringify(filtered));
      return filtered;
    });
  };

  // Scan handler
  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain) return;
    setLoading(true);
    setResult(null);
    setOtherTags([]);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      setResult(data);
      saveToHistory(domain);
      // Fetch HTML for other tag detection
      if (data && typeof data === "object" && !data.error) {
        const html = data.html || data.rawHtml || data.pageHtml || data.body || data;
        if (typeof html === "string") {
          const found = otherTagDefs.filter(def => def.test(html)).map(def => ({ key: def.key, label: def.label }));
          setOtherTags(found);
        } else {
          // fallback: try to fetch HTML again
          try {
            const resp = await fetch(`https://${domain}`);
            const htmlText = await resp.text();
            const found = otherTagDefs.filter(def => def.test(htmlText)).map(def => ({ key: def.key, label: def.label }));
            setOtherTags(found);
          } catch {}
        }
      }
    } catch {
      setResult({ gtm: [], ga: [], error: "Failed to scan domain." });
    } finally {
      setLoading(false);
    }
  };

  // Click on history item
  const handleHistoryClick = (d: string) => {
    setDomain(d);
    setTimeout(() => {
      handleScan();
      inputRef.current?.blur();
    }, 100);
  };

  // Commentary notes
  const commentary = (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900 shadow-sm">
        <span className="mt-0.5">{InfoIcon}</span>
        <div>
          <div className="font-semibold mb-1">About GTM & GA</div>
          <div>
            <b>Google Tag Manager (GTM)</b> is a tag management system that allows you to deploy and manage marketing and analytics tags (such as Google Analytics) on your website without modifying the code directly. <b>Google Analytics (GA)</b> is a web analytics service that tracks and reports website traffic. GTM can be used to load GA and other tags dynamically.
          </div>
          <div className="mt-2">
            <b>Note:</b> This tool detects tags that are directly present in the page source. If GTM is present but GA is not detected, Google Analytics may still be loaded via GTM or other means.
          </div>
          <div className="mt-2 text-xs text-blue-700">
            For privacy and security reasons, it is not possible to see the internal configuration or contents of a GTM container from a public scan.
          </div>
        </div>
      </div>
      {/* Conditional note if GTM is present but GA is not */}
      {result && result.gtm.length > 0 && result.ga.length === 0 && !result.error && (
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-900 shadow-sm mt-2">
          <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <b>Heads up:</b> Google Analytics may still be present via Google Tag Manager, as GTM can load GA and other tags dynamically. This tool only detects tags directly present in the page source.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/90 shadow-xl rounded-xl p-6 sm:p-10 w-full max-w-4xl flex flex-col sm:flex-row gap-8 items-stretch">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="flex items-center justify-center sm:justify-start mb-2">
            {LogoIcon}
            <h1 className="text-2xl font-bold text-indigo-700">Tag Insights</h1>
          </div>
          <h2 className="text-base text-indigo-500 mb-4 text-center sm:text-left">Instantly check for Google Tag Manager and Analytics tags on any website.</h2>
          <form onSubmit={handleScan} className="flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter domain (e.g. example.com)"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              required
              pattern="^(?!https?://)([\w.-]+)$"
              title="Enter a domain without http(s)://"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !domain}
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </form>
          {/* Recent Scans */}
          {history.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold text-gray-700 mb-2 text-sm">Recent Scans</div>
              <div className="flex flex-wrap gap-2">
                {history.map((d) => (
                  <button
                    key={d}
                    className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-mono transition shadow-sm"
                    onClick={() => handleHistoryClick(d)}
                    type="button"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Right: Results Widget */}
        <div className="flex-1 flex flex-col justify-center min-h-[340px]">
          <div className="h-full flex flex-col justify-center">
            <div className="min-h-[140px]">
              {result && (
                <div className="animate-fade-in bg-white/60 backdrop-blur-md border border-indigo-100 shadow-2xl rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden">
                  {/* Legend */}
                  <div className="flex justify-center gap-4 mb-2">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-semibold shadow-sm">{GTMIcon} GTM</span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold shadow-sm">{GAIcon} GA</span>
                  </div>
                  {result.error ? (
                    <div className="text-red-600 font-medium text-center">{result.error}</div>
                  ) : (
                    <>
                      {/* GTM Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-green-700">{GTMIcon} GTM Tags</div>
                        {result.gtm.length > 0 ? (
                          <div className="flex flex-wrap gap-2 ml-2">
                            {result.gtm.map(tag => (
                              <span key={tag} className="flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-mono shadow hover:bg-green-200 transition cursor-pointer border border-green-200">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" strokeLinecap="round" /></svg>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 ml-2 mt-1">{EmptyIcon} <span className="italic">No GTM tags found</span></div>
                        )}
                      </div>
                      {/* Divider */}
                      <div className="my-2 border-t border-indigo-100" />
                      {/* GA Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-700">{GAIcon} GA Tags</div>
                        {result.ga.length > 0 ? (
                          <div className="flex flex-wrap gap-2 ml-2">
                            {result.ga.map(tag => (
                              <span key={tag} className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-mono shadow hover:bg-blue-200 transition cursor-pointer border border-blue-200">
                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 18v-2a4 4 0 014-4h8a4 4 0 014 4v2" strokeWidth="2" /><circle cx="12" cy="8" r="4" strokeWidth="2" /></svg>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 ml-2 mt-1">{EmptyIcon} <span className="italic">No GA tags found</span></div>
                        )}
                      </div>
                      {/* Other Tags Section */}
                      {otherTags.length > 0 && (
                        <>
                          <div className="my-2 border-t border-indigo-100" />
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-lg font-bold text-purple-700">
                              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" /></svg>
                              Other Tags
                            </div>
                            <div className="flex flex-wrap gap-2 ml-2">
                              {otherTags.map(tag => (
                                <span key={tag.key} className="flex items-center gap-2 bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-mono shadow hover:bg-purple-200 transition cursor-pointer border border-purple-200">
                                  {otherTagIcons[tag.key] || "🔍"} {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Commentary/Info Section below, full width */}
      {commentary}
      {/* Fade-in animation keyframes */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <footer className="w-full flex justify-center mt-8 mb-2">
        <div className="text-xs text-gray-400 text-center">© Angelo M. All rights reserved.</div>
      </footer>
    </div>
  );
}

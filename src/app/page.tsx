"use client";

import { useState } from 'react';
import TagScanner from './components/TagScanner';
import NoindexChecker from './components/NoindexChecker';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tags' | 'noindex'>('tags');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Analysis Tools</h1>
          <p className="text-xl text-gray-600">A suite of tools to help you analyze and optimize your website</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tags')}
                className={`${
                  activeTab === 'tags'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tag Scanner
              </button>
              <button
                onClick={() => setActiveTab('noindex')}
                className={`${
                  activeTab === 'noindex'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Noindex Checker
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'tags' ? <TagScanner /> : <NoindexChecker />}
        </div>
      </div>
    </main>
  );
}

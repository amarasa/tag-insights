"use client";

import { useState } from "react";
import TagScanner from "./components/TagScanner";
import NoindexChecker from "./components/NoindexChecker";
import SeoMetaChecker from "./components/SeoMetaChecker";

const TABS = [
	{ key: "tags", label: "Tag Scanner", component: <TagScanner /> },
	{ key: "noindex", label: "Noindex Checker", component: <NoindexChecker /> },
	{ key: "seo", label: "SEO Meta Checker", component: <SeoMetaChecker /> },
];

export default function Home() {
	const [activeTab, setActiveTab] = useState("tags");

	const currentTab = TABS.find((tab) => tab.key === activeTab) || TABS[0];

	return (
		<main className='min-h-screen bg-gray-100'>
			<div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Angelo&apos;s Digital Toolbox of Website Things
					</h1>
					<p className='text-xl text-gray-600'>
						A comprehensive set of tools for analyzing and
						optimizing your website&apos;s marketing implementation
					</p>
				</div>

				<div className='mb-8 border-b border-gray-200'>
					<nav className='flex space-x-8' role='tablist'>
						{TABS.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`
                  pb-3 px-1 text-base font-medium focus:outline-none
                  border-b-2 transition-colors
                  ${
						activeTab === tab.key
							? "border-blue-600 text-blue-600"
							: "border-transparent text-gray-500 hover:text-blue-600"
					}
                `}
								aria-selected={activeTab === tab.key}
								aria-controls={`panel-${tab.key}`}
								role='tab'
							>
								{tab.label}
							</button>
						))}
					</nav>
				</div>

				<div id={`panel-${currentTab.key}`} role='tabpanel'>
					{currentTab.component}
				</div>
			</div>
		</main>
	);
}

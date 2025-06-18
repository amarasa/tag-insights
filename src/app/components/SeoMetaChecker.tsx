"use client";

import { useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Tooltip from "./Tooltip";

interface MetaAnalysis {
	title: {
		content: string;
		length: number;
		isOptimal: boolean;
		recommendations: string[];
	};
	description: {
		content: string;
		length: number;
		isOptimal: boolean;
		recommendations: string[];
	};
	h1: {
		content: string;
		count: number;
		isOptimal: boolean;
		recommendations: string[];
	};
	ogTags: {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
		type?: string;
		recommendations: string[];
	};
	twitterTags: {
		card?: string;
		title?: string;
		description?: string;
		image?: string;
		recommendations: string[];
	};
	canonical: {
		url?: string;
		isPresent: boolean;
		recommendations: string[];
	};
}

const tooltips = {
	title: (
		<div>
			<p className='font-semibold mb-1'>Title Tag</p>
			<p>
				The title tag is one of the most important SEO elements. It
				should be:
			</p>
			<ul className='list-disc list-inside mt-1 text-xs'>
				<li>50-60 characters long</li>
				<li>Include your main keyword</li>
				<li>Be unique for each page</li>
				<li>Use a separator (| or -) for readability</li>
			</ul>
		</div>
	),
	description: (
		<div>
			<p className='font-semibold mb-1'>Meta Description</p>
			<p>The meta description appears in search results. It should:</p>
			<ul className='list-disc list-inside mt-1 text-xs'>
				<li>Be 150-160 characters long</li>
				<li>Include a call-to-action</li>
				<li>Be unique for each page</li>
				<li>Accurately describe the page content</li>
			</ul>
		</div>
	),
	h1: (
		<div>
			<p className='font-semibold mb-1'>H1 Tag</p>
			<p>The H1 tag is the main heading of your page. Best practices:</p>
			<ul className='list-disc list-inside mt-1 text-xs'>
				<li>Use only one H1 tag per page</li>
				<li>Include your main keyword</li>
				<li>Be descriptive and unique</li>
				<li>Match user intent</li>
			</ul>
		</div>
	),
	ogTags: (
		<div>
			<p className='font-semibold mb-1'>Open Graph Tags</p>
			<p>
				Open Graph tags control how your content appears when shared on
				social media. Essential tags:
			</p>
			<ul className='list-disc list-inside mt-1 text-xs'>
				<li>og:title - The title of your content</li>
				<li>og:description - A description of your content</li>
				<li>og:image - An image URL</li>
				<li>og:url - The canonical URL</li>
				<li>og:type - The type of content</li>
			</ul>
		</div>
	),
	twitterTags: (
		<div>
			<p className='font-semibold mb-1'>Twitter Card Tags</p>
			<p>
				Twitter Card tags control how your content appears when shared
				on Twitter. Essential tags:
			</p>
			<ul className='list-disc list-inside mt-1 text-xs'>
				<li>twitter:card - The type of card</li>
				<li>twitter:title - The title of your content</li>
				<li>twitter:description - A description of your content</li>
				<li>twitter:image - An image URL</li>
			</ul>
		</div>
	),
	canonical: (
		<div>
			<p className='font-semibold mb-1'>Canonical URL</p>
			<p>
				The canonical URL helps prevent duplicate content issues by
				telling search engines which URL is the main version of a page.
			</p>
			<p className='mt-2 text-xs'>
				Example:{" "}
				<code>
					&lt;link rel=&quot;canonical&quot;
					href=&quot;https://example.com/page&quot; /&gt;
				</code>
			</p>
		</div>
	),
};

export default function SeoMetaChecker() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<MetaAnalysis | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCheck = async () => {
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch("/api/seo-meta", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ domain: url }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to check SEO meta tags");
			}
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const MetaSection = ({
		title,
		tooltip,
		children,
	}: {
		title: string;
		tooltip: React.ReactNode;
		children: React.ReactNode;
	}) => (
		<div className='bg-gray-50 p-4 rounded-lg'>
			<div className='flex items-center gap-2 mb-2'>
				<h3 className='font-semibold text-gray-900'>{title}</h3>
				<Tooltip content={tooltip} icon />
			</div>
			{children}
		</div>
	);

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<div className='flex items-center gap-2 mb-4'>
				<h2 className='text-2xl font-bold text-gray-900'>
					SEO Meta Checker
				</h2>
				<Tooltip
					content={
						<div>
							<p className='font-semibold mb-1'>
								About SEO Meta Tags
							</p>
							<p>
								This tool analyzes your website&apos;s meta tags
								and provides recommendations for improving your
								SEO. It checks:
							</p>
							<ul className='list-disc list-inside mt-1 text-xs'>
								<li>Title tags and meta descriptions</li>
								<li>H1 headings</li>
								<li>Open Graph tags for social sharing</li>
								<li>Twitter Card tags</li>
								<li>Canonical URLs</li>
							</ul>
						</div>
					}
					icon
				/>
			</div>

			<div className='flex gap-4 mb-6'>
				<input
					type='text'
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder='Enter website URL (e.g., example.com)'
					className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#22292f]'
				/>
				<button
					onClick={handleCheck}
					disabled={loading || !url}
					className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{loading ? "Checking..." : "Check"}
				</button>
			</div>

			{error && (
				<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6'>
					{error}
				</div>
			)}

			{result && (
				<div className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<MetaSection title='Title Tag' tooltip={tooltips.title}>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									{result.title.isOptimal ? (
										<CheckCircleIcon className='h-5 w-5 text-green-500' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-500' />
									)}
									<span
										className={
											result.title.isOptimal
												? "text-green-600"
												: "text-red-600"
										}
									>
										{result.title.length} characters
									</span>
								</div>
								<div className='text-sm font-mono bg-white p-2 rounded text-[#22292f]'>
									{result.title.content ||
										"No title tag found"}
								</div>
								{result.title.recommendations.length > 0 && (
									<ul className='text-sm text-red-600 list-disc list-inside'>
										{result.title.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>

						<MetaSection
							title='Meta Description'
							tooltip={tooltips.description}
						>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									{result.description.isOptimal ? (
										<CheckCircleIcon className='h-5 w-5 text-green-500' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-500' />
									)}
									<span
										className={
											result.description.isOptimal
												? "text-green-600"
												: "text-red-600"
										}
									>
										{result.description.length} characters
									</span>
								</div>
								<div className='text-sm font-mono bg-white p-2 rounded text-[#22292f]'>
									{result.description.content ||
										"No meta description found"}
								</div>
								{result.description.recommendations.length >
									0 && (
									<ul className='text-sm text-red-600 list-disc list-inside'>
										{result.description.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>

						<MetaSection title='H1 Tag' tooltip={tooltips.h1}>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									{result.h1.isOptimal ? (
										<CheckCircleIcon className='h-5 w-5 text-green-500' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-500' />
									)}
									<span
										className={
											result.h1.isOptimal
												? "text-green-600"
												: "text-red-600"
										}
									>
										{result.h1.count} H1 tag
										{result.h1.count !== 1 ? "s" : ""} found
									</span>
								</div>
								{result.h1.content && (
									<div className='text-sm font-mono bg-white p-2 rounded text-[#22292f]'>
										{result.h1.content}
									</div>
								)}
								{result.h1.recommendations.length > 0 && (
									<ul className='text-sm text-red-600 list-disc list-inside'>
										{result.h1.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>

						<MetaSection
							title='Canonical URL'
							tooltip={tooltips.canonical}
						>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									{result.canonical.isPresent ? (
										<CheckCircleIcon className='h-5 w-5 text-green-500' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-500' />
									)}
									<span
										className={
											result.canonical.isPresent
												? "text-green-600"
												: "text-red-600"
										}
									>
										{result.canonical.isPresent
											? "Canonical URL found"
											: "No canonical URL found"}
									</span>
								</div>
								{result.canonical.url && (
									<div className='text-sm font-mono bg-white p-2 rounded text-[#22292f]'>
										{result.canonical.url}
									</div>
								)}
								{result.canonical.recommendations.length >
									0 && (
									<ul className='text-sm text-red-600 list-disc list-inside'>
										{result.canonical.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<MetaSection
							title='Open Graph Tags'
							tooltip={tooltips.ogTags}
						>
							<div className='space-y-2'>
								{Object.entries(result.ogTags)
									.filter(
										([key]) => key !== "recommendations"
									)
									.map(([key, value]) => (
										<div
											key={key}
											className='flex items-start gap-2'
										>
											<span className='text-sm font-mono text-[#22292f]'>
												{key}:
											</span>
											<span className='text-sm flex-1 text-[#22292f]'>
												{value || (
													<span className='text-red-500'>
														Not set
													</span>
												)}
											</span>
										</div>
									))}
								{result.ogTags.recommendations.length > 0 && (
									<ul className='text-sm text-red-600 list-disc list-inside mt-2'>
										{result.ogTags.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>

						<MetaSection
							title='Twitter Card Tags'
							tooltip={tooltips.twitterTags}
						>
							<div className='space-y-2'>
								{Object.entries(result.twitterTags)
									.filter(
										([key]) => key !== "recommendations"
									)
									.map(([key, value]) => (
										<div
											key={key}
											className='flex items-start gap-2'
										>
											<span className='text-sm font-mono text-[#22292f]'>
												{key}:
											</span>
											<span className='text-sm flex-1 text-[#22292f]'>
												{value || (
													<span className='text-red-500'>
														Not set
													</span>
												)}
											</span>
										</div>
									))}
								{result.twitterTags.recommendations.length >
									0 && (
									<ul className='text-sm text-red-600 list-disc list-inside mt-2'>
										{result.twitterTags.recommendations.map(
											(rec, i) => (
												<li key={i}>{rec}</li>
											)
										)}
									</ul>
								)}
							</div>
						</MetaSection>
					</div>
				</div>
			)}
		</div>
	);
}

import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

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

function analyzeTitle(title: string | null): { content: string; length: number; isOptimal: boolean; recommendations: string[] } {
  const recommendations: string[] = [];
  const content = title || '';
  const length = content.length;

  if (!content) {
    recommendations.push('Add a title tag to your page');
  } else {
    if (length < 30) {
      recommendations.push('Title is too short. Aim for 50-60 characters');
    } else if (length > 60) {
      recommendations.push('Title is too long. Keep it under 60 characters');
    }
    if (!content.includes('|') && !content.includes('-')) {
      recommendations.push('Consider using a separator (| or -) to improve readability');
    }
  }

  return {
    content,
    length,
    isOptimal: length >= 30 && length <= 60,
    recommendations
  };
}

function analyzeDescription(description: string | null): { content: string; length: number; isOptimal: boolean; recommendations: string[] } {
  const recommendations: string[] = [];
  const content = description || '';
  const length = content.length;

  if (!content) {
    recommendations.push('Add a meta description to your page');
  } else {
    if (length < 120) {
      recommendations.push('Description is too short. Aim for 150-160 characters');
    } else if (length > 160) {
      recommendations.push('Description is too long. Keep it under 160 characters');
    }
    if (content.endsWith('...')) {
      recommendations.push('Avoid ending description with ellipsis');
    }
  }

  return {
    content,
    length,
    isOptimal: length >= 120 && length <= 160,
    recommendations
  };
}

function analyzeH1(h1Elements: HTMLHeadingElement[]): { content: string; count: number; isOptimal: boolean; recommendations: string[] } {
  const recommendations: string[] = [];
  const count = h1Elements.length;
  const content = h1Elements[0]?.textContent || '';

  if (count === 0) {
    recommendations.push('Add an H1 tag to your page');
  } else if (count > 1) {
    recommendations.push('Multiple H1 tags found. Use only one H1 tag per page');
  }

  return {
    content,
    count,
    isOptimal: count === 1,
    recommendations
  };
}

function analyzeOgTags(doc: Document): { title?: string; description?: string; image?: string; url?: string; type?: string; recommendations: string[] } {
  const recommendations: string[] = [];
  const ogTags = {
    title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || undefined,
    description: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || undefined,
    image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined,
    url: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || undefined,
    type: doc.querySelector('meta[property="og:type"]')?.getAttribute('content') || undefined,
    recommendations: [] as string[]
  };

  if (!ogTags.title) recommendations.push('Add og:title meta tag');
  if (!ogTags.description) recommendations.push('Add og:description meta tag');
  if (!ogTags.image) recommendations.push('Add og:image meta tag');
  if (!ogTags.url) recommendations.push('Add og:url meta tag');
  if (!ogTags.type) recommendations.push('Add og:type meta tag');

  ogTags.recommendations = recommendations;
  return ogTags;
}

function analyzeTwitterTags(doc: Document): { card?: string; title?: string; description?: string; image?: string; recommendations: string[] } {
  const recommendations: string[] = [];
  const twitterTags = {
    card: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || undefined,
    title: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || undefined,
    description: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || undefined,
    image: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || undefined,
    recommendations: [] as string[]
  };

  if (!twitterTags.card) recommendations.push('Add twitter:card meta tag');
  if (!twitterTags.title) recommendations.push('Add twitter:title meta tag');
  if (!twitterTags.description) recommendations.push('Add twitter:description meta tag');
  if (!twitterTags.image) recommendations.push('Add twitter:image meta tag');

  twitterTags.recommendations = recommendations;
  return twitterTags;
}

function analyzeCanonical(doc: Document): { url?: string; isPresent: boolean; recommendations: string[] } {
  const recommendations: string[] = [];
  const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const isPresent = !!canonicalUrl;

  if (!isPresent) {
    recommendations.push('Add a canonical URL to prevent duplicate content issues');
  }

  return {
    url: canonicalUrl || undefined,
    isPresent,
    recommendations
  };
}

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain." }, { status: 400 });
    }

    const normalized = domain.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const fetchUrl = `https://${normalized}`;

    const res = await fetch(fetchUrl, { 
      headers: { "User-Agent": "Mozilla/5.0" } 
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch site: ${res.status}` }, { status: 400 });
    }

    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const analysis: MetaAnalysis = {
      title: analyzeTitle(doc.querySelector('title')?.textContent || null),
      description: analyzeDescription(doc.querySelector('meta[name="description"]')?.getAttribute('content') || null),
      h1: analyzeH1(Array.from(doc.querySelectorAll('h1'))),
      ogTags: analyzeOgTags(doc),
      twitterTags: analyzeTwitterTags(doc),
      canonical: analyzeCanonical(doc)
    };

    return NextResponse.json(analysis);
  } catch (err: unknown) {
    let message = "Unknown error.";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 
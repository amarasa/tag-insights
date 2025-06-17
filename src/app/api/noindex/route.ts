import { NextRequest, NextResponse } from "next/server";

interface NoindexCheckResult {
  hasNoindexMeta: boolean;
  hasNoindexRobots: boolean;
  robotsTxtContent?: string;
  metaTags: string[];
  url: string;
}

async function fetchRobotsTxt(domain: string): Promise<string | null> {
  try {
    const response = await fetch(`https://${domain}/robots.txt`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch {
    return null;
  }
}

function checkRobotsTxt(content: string | null): boolean {
  if (!content) return false;
  const lines = content.toLowerCase().split('\n');
  return lines.some(line => {
    const trimmedLine = line.trim();
    return trimmedLine.startsWith('noindex:') || 
           (trimmedLine.startsWith('disallow:') && trimmedLine.includes('noindex'));
  });
}

function extractMetaTags(html: string): string[] {
  const metaRegex = /<meta[^>]+>/g;
  return Array.from(html.matchAll(metaRegex)).map(match => match[0]);
}

function checkNoindexMeta(metaTags: string[]): boolean {
  return metaTags.some(tag => 
    tag.toLowerCase().includes('noindex') ||
    tag.toLowerCase().includes('robots') && tag.toLowerCase().includes('noindex')
  );
}

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain." }, { status: 400 });
    }

    const normalized = domain.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
    const fetchUrl = `https://${normalized}`;

    // Fetch the main page
    const res = await fetch(fetchUrl, { 
      headers: { "User-Agent": "Mozilla/5.0" } 
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch site: ${res.status}` }, { status: 400 });
    }

    const html = await res.text();
    const metaTags = extractMetaTags(html);
    const hasNoindexMeta = checkNoindexMeta(metaTags);

    // Fetch and check robots.txt
    const robotsTxt = await fetchRobotsTxt(normalized);
    const hasNoindexRobots = checkRobotsTxt(robotsTxt);

    const result: NoindexCheckResult = {
      hasNoindexMeta,
      hasNoindexRobots,
      robotsTxtContent: robotsTxt || undefined,
      metaTags,
      url: fetchUrl
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    let message = "Unknown error.";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 
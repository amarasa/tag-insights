import { NextRequest, NextResponse } from "next/server";

function extractTags(html: string) {
  // GTM: GTM-XXXXXXX
  const gtmRegex = /GTM-([A-Z0-9]+)/g;
  // GA: UA-XXXXXXX(-X) or G-XXXXXXXXXX
  const gaRegex = /(UA-\d{4,}-\d+|G-[A-Z0-9]+)/g;

  const gtm = Array.from(new Set(Array.from(html.matchAll(gtmRegex)).map(m => `GTM-${m[1]}`)));
  const ga = Array.from(new Set(Array.from(html.matchAll(gaRegex)).map(m => m[1].startsWith('UA-') ? m[1] : `G-${m[1].split('-')[1]}`)));

  return { gtm, ga };
}

function normalizeDomain(input: string): string {
  let url = input.trim();
  // Remove protocol if present
  url = url.replace(/^https?:\/\//i, "");
  // Remove trailing slash
  url = url.replace(/\/$/, "");
  return url;
}

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain." }, { status: 400 });
    }
    const normalized = normalizeDomain(domain);
    const fetchUrl = `https://${normalized}`;
    const res = await fetch(fetchUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch site: ${res.status}` }, { status: 400 });
    }
    const html = await res.text();
    const tags = extractTags(html);
    return NextResponse.json(tags);
  } catch (err: unknown) {
    let message = "Unknown error.";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ gtm: [], ga: [], error: message }, { status: 500 });
  }
} 
# Tag Insights

A modern web tool to instantly check any website for Google Tag Manager (GTM), Google Analytics (GA), and other popular marketing/analytics tags.

![Tag Insights Screenshot](public/next.svg)

## Features

- **Detects Google Tag Manager (GTM) and Google Analytics (GA) tags**
- **Detects other popular tags:**
  - Facebook Pixel
  - Hotjar
  - LinkedIn Insight
  - Microsoft Clarity
  - Twitter Pixel
  - Pinterest Tag
  - TikTok Pixel
- **Recent Scans:** Keeps a local history of your recently scanned domains for quick access
- **Professional, responsive UI** with Tailwind CSS
- **Clear commentary** on GTM vs GA and tag detection limitations

## How It Works

1. Enter a domain (e.g. `example.com`) and click **Scan**
2. Tag Insights fetches the website and scans for GTM, GA, and other supported tags
3. Results are displayed in a modern dashboard, with commentary and a list of any detected tags
4. Your recent scans are saved locally for easy re-scanning

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The easiest way to deploy Tag Insights is with [Vercel](https://vercel.com/):
- Push your code to GitHub
- Import your repo into Vercel
- Deploy (Vercel auto-detects Next.js and API routes)

Other options: Netlify, Render, or any Node.js server that supports Next.js API routes.

## License

MIT

---

© Angelo M. All rights reserved.

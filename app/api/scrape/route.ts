import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Call the Python backend for actual web scraping
    // Use 127.0.0.1 to avoid Node.js resolving localhost to IPv6 (::1) while Flask listens on IPv4
    const response = await fetch('http://127.0.0.1:5000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Scraping failed' }, { status: 500 });
  }
}
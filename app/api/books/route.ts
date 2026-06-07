import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ docs: [] });
  const res = await fetch(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=8&fields=key,title,author_name,cover_i,first_publish_year`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}

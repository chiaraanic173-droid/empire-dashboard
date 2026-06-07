'use client';
import { Card, SectionTitle } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';
import Image from 'next/image';

type Book = { key: string; title: string; author: string; coverId?: number; year?: number };
type BookWithDate = Book & { finishedDate: string };

export default function BooksTab({ shared }: { shared: Store }) {
  const currentBook = shared.data.currentBook as Book | null;
  const wantToRead = (shared.data.wantToRead as Book[]) ?? [];
  const booksRead = (shared.data.booksRead as BookWithDate[]) ?? [];

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const docs = (data.docs ?? []).map((d: { key: string; title: string; author_name?: string[]; cover_i?: number; first_publish_year?: number }) => ({
        key: d.key,
        title: d.title,
        author: d.author_name?.[0] ?? 'Unknown',
        coverId: d.cover_i,
        year: d.first_publish_year,
      }));
      setResults(docs);
    } finally {
      setSearching(false);
    }
  }

  function setCurrentBook(book: Book) {
    shared.update('currentBook', book);
    setResults([]);
    setQuery('');
  }

  function addToWantToRead(book: Book) {
    if (wantToRead.find((b) => b.key === book.key)) return;
    shared.update('wantToRead', [...wantToRead, book]);
  }

  function markDone() {
    if (!currentBook) return;
    const today = new Date().toISOString().split('T')[0];
    shared.update('booksRead', [...booksRead, { ...currentBook, finishedDate: today }]);
    shared.update('currentBook', null);
  }

  function removeWant(key: string) {
    shared.update('wantToRead', wantToRead.filter((b) => b.key !== key));
  }

  function setCurrentFromWant(book: Book) {
    shared.update('currentBook', book);
    removeWant(book.key);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Currently Reading Banner */}
      {currentBook && (
        <div className="relative rounded-xl overflow-hidden p-5 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, #2A2118, #211E1A)', border: '1px solid #C9A84C44' }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#C9A84C' }} />
          {currentBook.coverId && (
            <Image
              src={`https://covers.openlibrary.org/b/id/${currentBook.coverId}-M.jpg`}
              alt={currentBook.title}
              width={60}
              height={90}
              className="rounded shadow-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <p className="section-label" style={{ color: '#C9A84C' }}>Currently Reading 📖</p>
            <p className="font-display text-2xl" style={{ color: '#FAF7F2' }}>{currentBook.title}</p>
            <p className="text-sm opacity-50">by {currentBook.author}</p>
          </div>
          <button className="btn-gold" onClick={markDone}>Mark Done ✓</button>
        </div>
      )}

      {/* Search */}
      <Card>
        <SectionTitle color="gold">Find a Book</SectionTitle>
        <div className="flex gap-2 mb-4">
          <input
            className="empire-input flex-1"
            placeholder="Search by title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button className="btn-gold" onClick={search} disabled={searching}>
            {searching ? '…' : 'Search'}
          </button>
        </div>
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {results.map((book) => (
              <div key={book.key} className="rounded-lg p-3" style={{ background: '#2A2622', border: '1px solid #3A3530' }}>
                {book.coverId && (
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`}
                    alt={book.title}
                    width={80}
                    height={110}
                    className="rounded mb-2 object-cover"
                  />
                )}
                <p className="text-xs font-medium mb-0.5 line-clamp-2">{book.title}</p>
                <p className="text-xs opacity-40 mb-2">{book.author} {book.year ? `(${book.year})` : ''}</p>
                <div className="flex flex-col gap-1">
                  <button className="btn-gold text-xs" onClick={() => setCurrentBook(book)}>📖 Read Now</button>
                  <button className="btn-ghost text-xs" onClick={() => addToWantToRead(book)}>+ Want to Read</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Want to Read */}
        <Card>
          <SectionTitle color="gold">Want to Read</SectionTitle>
          <div className="space-y-2">
            {wantToRead.map((b) => (
              <div key={b.key} className="flex items-center gap-3 group p-2 rounded" style={{ background: '#C9A84C0A' }}>
                {b.coverId && (
                  <Image src={`https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`} alt={b.title} width={30} height={45} className="rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{b.title}</p>
                  <p className="text-xs opacity-40">{b.author}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-gold text-xs px-2" onClick={() => setCurrentFromWant(b)}>Read</button>
                  <button className="btn-ghost text-xs px-2" onClick={() => removeWant(b.key)}>✕</button>
                </div>
              </div>
            ))}
            {wantToRead.length === 0 && <p className="text-xs opacity-30 italic">Search for books to add</p>}
          </div>
        </Card>

        {/* Books Read */}
        <Card>
          <SectionTitle color="gold">Read This Quarter ✨</SectionTitle>
          <div className="space-y-2">
            {booksRead.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded" style={{ background: '#C9A84C0A' }}>
                {b.coverId && (
                  <Image src={`https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`} alt={b.title} width={30} height={45} className="rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{b.title}</p>
                  <p className="text-xs opacity-40">{b.author} · Finished {b.finishedDate}</p>
                </div>
                <span className="text-lg">✓</span>
              </div>
            ))}
            {booksRead.length === 0 && <p className="text-xs opacity-30 italic">No books finished yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

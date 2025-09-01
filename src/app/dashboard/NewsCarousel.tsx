
"use client";
import { useState, useEffect } from "react";
// Helper to format date as 'yyyy-mmmm-dd' or 'n days ago'
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  // Format as yyyy-mmmm-dd
  const yyyy = date.getFullYear();
  const mmmm = date.toLocaleString('default', { month: 'long' });
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mmmm}-${dd}`;
}
import Link from "next/link";

type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  priority?: number;
  fullStory?: string;
};


export default function NewsCarousel() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // default to desktop
  const [popupItem, setPopupItem] = useState<NewsItem | null>(null);
  const [showFullStory, setShowFullStory] = useState(false);

  // Responsive visibleCount
  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth < 640) {
        setVisibleCount(1); // mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2); // tablet
      } else {
        setVisibleCount(3); // desktop
      }
    }
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setNewsItems(data);
        }
      } catch (e) {}
    }
    fetchNews();
  }, []);

  const end = start + visibleCount;
  const prev = () => setStart(Math.max(0, start - visibleCount));
  const next = () => setStart(Math.min(newsItems.length - visibleCount, start + visibleCount));

  return (
    <>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 w-full flex-grow relative px-0 mx-0">
        <button
          onClick={prev}
          disabled={start === 0}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-blue-100 shadow-xl border-2 border-blue-900 hover:scale-110 hover:bg-blue-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous news"
          style={{zIndex:2}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
  <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto py-1 sm:py-2 w-full flex-grow">
          {newsItems.slice(start, end).map((item) => (
            <div
              key={item.slug}
              className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-blue-950 rounded-2xl shadow-2xl border-2 border-gray-700 hover:border-blue-400 p-4 sm:p-6 min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-between cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-blue-900/40 flex-1 basis-0 min-w-0"
              onClick={() => { setPopupItem(item); setShowFullStory(false); }}
              style={{zIndex:1}}
            >
              <h3 className="font-bold text-base sm:text-lg text-blue-100 mb-2 text-left w-full break-words drop-shadow-lg tracking-tight">{item.title}</h3>
              <div className="text-xs text-blue-300 mb-2 font-mono tracking-wide w-full text-left">{formatDate(item.date)}</div>
              <div className="text-gray-200 text-xs sm:text-sm whitespace-pre-line text-justify mb-2 leading-relaxed drop-shadow-sm px-2 line-clamp-4 w-full">{item.summary}</div>
            </div>
          ))}
        </div>
        <button
          onClick={next}
          disabled={end >= newsItems.length}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-blue-100 shadow-xl border-2 border-blue-900 hover:scale-110 hover:bg-blue-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed absolute right-0 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0"
          aria-label="Next news"
          style={{zIndex:2}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Modal Popup */}
      {popupItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-0" style={{overflowY:'auto'}}>
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-950 rounded-2xl shadow-2xl border-2 border-blue-700 p-4 sm:p-8 w-full max-w-lg max-h-[90vh] flex flex-col items-center" style={{minHeight:0, boxShadow:'0 12px 48px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.18)', border:'2.5px solid #23272f', overflowY:'auto'}}>
            {/* Close button */}
            <button
              className="absolute top-3 right-3 z-20 bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-blue-800 hover:to-pink-700 shadow-lg rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 border-2 border-gray-600 hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{pointerEvents:'auto'}}
              onClick={() => setPopupItem(null)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Card accent */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-gradient-to-r from-blue-400/20 via-purple-400/10 to-pink-400/20 rounded-full blur-2xl opacity-40 pointer-events-none" />
            <h2 className="font-extrabold text-2xl md:text-3xl text-blue-100 mb-2 text-center break-words mt-2 drop-shadow-lg tracking-tight">{popupItem.title}</h2>
            <div className="text-xs text-blue-300 mb-4 font-mono tracking-wide">{popupItem.date}</div>
            <div className="prose prose-invert max-w-none w-full mb-2" style={{color:'#e5e7eb'}} dangerouslySetInnerHTML={{ __html: popupItem.fullStory || popupItem.summary }} />
            <div className="flex-1" />
            <Link
              href={`/news/${popupItem.slug}`}
              className="mt-6 mb-2 px-7 py-0 bg-gradient-to-r from-gray-600 via-gray-900 to-blue-900 text-blue-100 font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-900 hover:to-gray-800 hover:bg-gradient-to-l transition-all duration-200 border-2 border-gray-700 hover:border-blue-400 text-lg flex items-center gap-2 tracking-wide uppercase"
              style={{alignSelf:'center', letterSpacing:'0.04em'}}
              onClick={() => setPopupItem(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
              </svg>
              Read More
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

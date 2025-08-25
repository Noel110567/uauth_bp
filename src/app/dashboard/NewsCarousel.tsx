"use client";
import { useState, useEffect } from "react";
import Link from "next/link";


type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  priority?: number;
};




export default function NewsCarousel() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setNewsItems(data);
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const end = start + visibleCount;

  const prev = () => setStart((s) => Math.max(0, s - visibleCount));
  const next = () => setStart((s) => Math.min(newsItems.length - visibleCount, s + visibleCount));

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .carousel-fixed {
            left: 0 !important;
            width: 100vw !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
      <div
        className="z-50 flex justify-end carousel-fixed"
        style={{
          position: 'fixed',
          left: '256px',
          right: 0,
          bottom: 40, // 20px margin + 20px for footer height
          marginRight: 20,
          width: 'calc(100vw - 256px - 20px)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="relative rounded-xl shadow-2xl flex items-center px-0 py-1 gap-1"
          style={{
            minHeight: 110,
            background: 'linear-gradient(90deg, #23272f 0%, #343a40 100%)',
            color: 'white',
            width: '100%',
            pointerEvents: 'auto',
          }}
        >
        <button
          onClick={prev}
          disabled={start === 0}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-gray-200 shadow-xl border-2 border-gray-900 hover:scale-110 hover:bg-gray-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous news"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div
          className="flex flex-1 justify-center gap-2"
          style={{ overflow: 'hidden', width: '100%' }}
        >
          {newsItems.slice(start, end).map((item, idx) => {
            // Calculate width based on visibleCount
            const gapPx = 8; // 0.5rem gap-2
            const totalGap = gapPx * (visibleCount - 1);
            const cardWidth = `calc((90vw - ${totalGap}px) / ${visibleCount})`;
            return (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                scroll={false}
                className="bg-gray-100 bg-opacity-90 rounded-lg shadow p-2 flex flex-col justify-between hover:ring-2 hover:ring-blue-400 transition"
                style={{
                  textDecoration: 'none',
                  minHeight: 90,
                  maxHeight: 110,
                  width: cardWidth,
                  maxWidth: 220,
                  minWidth: 0,
                }}
                shallow
              >
                <h3 className="font-bold text-base text-gray-900 mb-0 leading-tight">{item.title}</h3>
                <div className="text-[10px] font-thin text-gray-500 mb-1 mt-0.5">{item.date?.toString().slice(0,10)}</div>
                <p className="text-gray-700 text-xs leading-snug line-clamp-3 overflow-hidden" style={{display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical'}}>{item.summary}</p>
              </Link>
            );
          })}
        </div>
        <button
          onClick={next}
          disabled={end >= newsItems.length}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-gray-200 shadow-xl border-2 border-gray-900 hover:scale-110 hover:bg-gray-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next news"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
    </>
  );
}

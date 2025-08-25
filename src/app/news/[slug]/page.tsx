"use client";

import NewsCarouselWrapper from "./NewsCarouselWrapper";
import { notFound } from "next/navigation";




import { useEffect, useState } from "react";

type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  priority?: number;
};

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data: NewsItem[] = await res.json();
          const found = data.find((n) => n.slug === params.slug);
          setNews(found || null);
        }
      } catch (e) {
        setNews(null);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [params.slug]);

  if (loading) return null;
  if (!news) return notFound();
  return (
    <>
  {/* NewsCarouselWrapper is now globally mounted in main-layout */}
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
        <div className="text-xs font-thin text-gray-400 mb-4">Published: {news.date?.toString().slice(0,10)}</div>
        <p className="text-lg text-gray-700">{news.summary}</p>
      </div>
    </>
  );
}

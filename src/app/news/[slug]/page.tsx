
"use client";


import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type NewsItem = {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  fullStory?: string;
  images?: string[];
  date: string;
  priority?: number;
};


export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { data: session } = useSession();
  const { slug } = use(params);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchAllNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data: NewsItem[] = await res.json();
          console.log('Fetched newsData:', data);
          setAllNews(data);
          const found = data.find((n) => n.slug.trim().toLowerCase() === slug.trim().toLowerCase());
          setNews(found || null);
        }
      } catch {
        setAllNews([]);
        setNews(null);
      } finally {
        setLoading(false);
      }
    }
    const urlSlug = slug.trim().toLowerCase();
    const allSlugs = allNews.map(n => n.slug.trim().toLowerCase());
    console.log('URL slug:', urlSlug);
    console.log('All news slugs:', allSlugs);
    fetchAllNews();
  }, [slug]);

  if (!news && !loading) return notFound();

  return (
    <div className="relative max-w-3xl mx-auto p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 m-0">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {news && (
        <>
          <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
          <div className="text-xs font-thin text-gray-400 mb-4">Published: {news.date?.toString().slice(0,10)}</div>
          <p className="text-lg text-gray-700 mb-4">{news.summary}</p>
          {news.images && news.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              {news.images.map((img, idx) => (
                <img key={idx} src={img} alt="news" className="w-48 h-32 object-cover rounded shadow border" />
              ))}
            </div>
          )}
          {news.fullStory && (
            <div className="prose prose-lg prose-blue max-w-none mb-4 max-h-96 overflow-auto border border-gray-200 rounded bg-gray-50 p-2 sm:p-3 md:p-4"
              style={{wordBreak:'break-word'}}>
              {/* Supports headings, paragraphs, lists, code, blockquotes, links, images, tables, etc. */}
              <div dangerouslySetInnerHTML={{ __html: news.fullStory }} />
            </div>
          )}
          <div className="mt-8 flex justify-end">
            {typeof news.id !== 'undefined' && session?.user?.role && ["admin", "editor"].includes(session.user.role) && (
              <a
                href={`/news/edit/${news.id}`}
                className="inline-block px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded transition"
              >
                Edit
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

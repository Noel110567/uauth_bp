
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/solid";

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

export default function NewsListSidebar() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNewsList(data));
  }, []);

  return (
  <aside className="w-full md:w-96 max-w-full md:max-w-xs p-2 sm:p-3 md:p-4 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg overflow-y-auto h-full min-h-[200px]">
      <div className="mb-4 flex flex-col gap-2">
        <a
          href="/news/search"
          className="block w-full text-center font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg py-2 shadow hover:bg-blue-50 transition mb-2"
        >
          🔍 Search News
        </a>
      </div>
      <div>
        {newsList.map((news) => (
          <div
            key={news.id || news.slug}
            className="bg-white/95 rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-3 hover:scale-[1.04] hover:shadow-2xl transition-all duration-200 cursor-pointer border border-blue-200/60 ring-1 ring-blue-100/60 relative overflow-hidden group min-h-[120px] sm:min-h-[150px] md:min-h-[170px]"
            onClick={() => router.push(`/news/${news.slug}`)}
          >
            {/* Decorative background accent */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full opacity-40 blur-2xl pointer-events-none group-hover:opacity-60 transition-all duration-300" />
            <div className="flex items-start gap-4">
              {news.images && news.images.length > 0 ? (
                <img
                  src={news.images[0]}
                  alt={news.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl border-2 border-blue-200 shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl border-2 border-blue-200 shadow-md flex-shrink-0">
                  <NewspaperIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-normal text-sm sm:text-base text-gray-900 mb-1 truncate group-hover:text-blue-700 transition-colors duration-200">
                  {news.title}
                </h3>
                <div className="text-xs text-blue-500 mb-1 sm:mb-2 font-medium tracking-wide">{news.date}</div>
                <p className="text-gray-700 text-xs sm:text-base leading-snug line-clamp-4 sm:line-clamp-5 group-hover:line-clamp-none transition-all duration-200">
                  {news.summary}
                </p>
              </div>
            </div>
            {/* Subtle bottom accent bar */}
            <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-blue-300/40 via-purple-300/40 to-pink-300/40 rounded-b-2xl" />
          </div>
        ))}
      </div>
    </aside>
  );
}

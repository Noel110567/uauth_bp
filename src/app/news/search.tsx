"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/news?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-200 mt-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          placeholder="Search news by title, summary, or slug..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition">Search</button>
      </form>
      {loading && <div className="text-blue-500">Searching...</div>}
      <ul className="divide-y divide-gray-200">
        {results.map((item) => (
          <li key={item.id} className="py-3 flex flex-col gap-1 cursor-pointer hover:bg-blue-50 rounded px-2" onClick={() => router.push(`/news/${item.slug}`)}>
            <span className="font-semibold text-blue-800">{item.title}</span>
            <span className="text-xs text-gray-500">{item.date}</span>
            <span className="text-sm text-gray-700 line-clamp-2">{item.summary}</span>
          </li>
        ))}
      </ul>
      {results.length === 0 && !loading && <div className="text-gray-400 text-center">No results found.</div>}
    </div>
  );
}

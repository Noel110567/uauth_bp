"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NewsFullStoryEditor from "../../components/NewsFullStoryEditor";

  type NewsItem = {
    title: string;
    summary: string;
    fullStory: string;
    images: string[];
    date: string;
    slug: string;
    priority: number;
  };
  const [news, setNews] = useState<NewsItem>({
    title: "",
    summary: "",
    fullStory: "",
    images: [],
    date: new Date().toISOString().slice(0, 10),
    slug: "",
    priority: 0,
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "images") {
      setNews({ ...news, images: e.target.value.split(",").map((s: string) => s.trim()) });
      return;
    }
    setNews({ ...news, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) {
      setNews((prev) => ({ ...prev, images: [...(prev.images || []), data.url] }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(news),
    });
    if (res.ok) {
      router.push("/news");
    } else {
      setError("Failed to add news item");
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full m-0">
        <h1 className="text-3xl font-bold mb-4">Add News</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-4xl mx-auto animate-fade-in">
          <div className="flex flex-col gap-8 w-full">
            <div>
              <label className="block mb-1 font-semibold text-lg text-blue-900">Title</label>
              <input name="title" className="border px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-400 transition" value={news.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-lg text-blue-900">Summary</label>
              <textarea name="summary" className="border px-4 py-3 rounded-lg w-full min-h-[80px] text-base focus:ring-2 focus:ring-blue-400 transition" value={news.summary} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-lg text-blue-900">Slug</label>
              <input name="slug" className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 transition" value={news.slug} onChange={handleChange} required />
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <label className="block mb-1 font-semibold text-blue-900">Date</label>
                <input name="date" type="date" className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 transition" value={news.date} onChange={handleChange} required />
              </div>
              <div className="flex-1 max-w-[180px]">
                <label className="block mb-1 font-semibold text-blue-900">Priority</label>
                <input name="priority" type="number" className="border px-3 py-2 rounded w-full text-center focus:ring-2 focus:ring-blue-400 transition" value={news.priority ?? 0} onChange={handleChange} min={0} max={100} />
                <span className="text-xs text-gray-500 block pt-1">(Higher = more prominent)</span>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-lg text-blue-900">Full Story</label>
              <div className="rounded-xl border-2 border-blue-100 shadow-inner bg-gray-50 p-2">
                <NewsFullStoryEditor
                  initialValue={news.fullStory ?? ""}
                  onSave={(html) => setNews({ ...news, fullStory: html })}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-blue-900">Images (comma separated URLs)</label>
              <input name="images" className="border px-3 py-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400 transition" value={news.images?.join(", ") ?? ""} onChange={handleChange} placeholder="https://... , https://..." />
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="border px-2 py-1 rounded" />
                {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
              </div>
              {news.images && news.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {news.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden shadow group">
                      <img src={img} alt="news" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition group-hover:scale-110"
                        title="Remove image"
                        onClick={() => setNews((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 rounded-xl shadow-lg text-lg tracking-wide transition-all duration-200">Add News</button>
        </form>
      </div>
    </div>
  );
}

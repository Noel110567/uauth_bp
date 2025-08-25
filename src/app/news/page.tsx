import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function NewsPage() {
  // Get absolute URL for fetch in server component
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${protocol}://${host}/api/news`;
  const res = await fetch(url, { cache: 'no-store' });
  const news = await res.json();

  if (Array.isArray(news) && news.length > 0) {
    // Redirect to the first news item's page
    redirect(`/news/${news[0].slug}`);
  }

  // If no news, show a message
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">No News Available</h1>
      <p className="text-gray-600">There are currently no news items to display.</p>
    </div>
  );
}

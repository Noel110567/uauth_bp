"use client";
import NewsListSidebar from "./NewsListSidebar";

export default function NewsLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-full mx-0 gap-6 px-2 sm:px-4 pt-8">
      <main className="flex-1 m-0 p-0">{children}</main>
      <div className="md:ml-0 md:mr-0 mt-2 md:mt-0">
        <NewsListSidebar />
      </div>
    </div>
  );
}

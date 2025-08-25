import NewsCarousel from "../dashboard/NewsCarousel";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-4">
        <NewsCarousel />
      </div>
      {children}
    </>
  );
}



export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-1">
  <h1 className="text-3xl font-bold mb-3 text-left mt-1 w-full max-w-5xl">Vision, Mission and Thrusts ...</h1>
  {/* Removed landing page label for more space */}
      <HomeImageSlider />
      <div className="w-full">
        <NewsCarousel />
      </div>
    </main>
  );
}
  const NewsCarousel = require("./dashboard/NewsCarousel").default;
  const HomeImageSlider = require("../components/HomeImageSlider").default;

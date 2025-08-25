

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
  <h1 className="text-3xl font-bold mb-6 text-left mt-5 w-full max-w-5xl">Vision, Mission and Thrusts ...</h1>
  {/* Removed landing page label for more space */}
      <HomeImageSlider />
      <div className="w-full max-w-5xl">
        <NewsCarousel />
      </div>
    </main>
  );
}
  const NewsCarousel = require("./dashboard/NewsCarousel").default;
  const HomeImageSlider = require("../components/HomeImageSlider").default;

"use client";
import { useState, useEffect } from "react";


export default function HomeImageSlider() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fetch images from API
  useEffect(() => {
    fetch("/api/slider-images")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images)) setImages(data.images);
      });
  }, []);


  const prev = () => setCurrent((c) => (images.length === 0 ? 0 : c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (images.length === 0 ? 0 : c === images.length - 1 ? 0 : c + 1));

  // Auto-slide every 7 seconds, pause/resume support
  useEffect(() => {
    if (images.length === 0 || paused) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [images, paused]);

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-8">
      <button
        onClick={() => setPaused((p) => !p)}
        className="absolute left-1/2 -translate-x-1/2 bottom-2 z-20 bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-xl border-2 border-white transition-all duration-200"
        aria-label={paused ? "Resume slider" : "Pause slider"}
        style={{outline: 'none'}}
      >
        {paused ? (
          // Play icon (YouTube style, smaller)
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-4 h-4">
            <circle cx="24" cy="24" r="22" fill="#fff" fillOpacity="0.15" />
            <polygon points="20,16 36,24 20,32" fill="#fff" />
          </svg>
        ) : (
          // Pause icon (YouTube style, smaller)
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-4 h-4">
            <circle cx="24" cy="24" r="22" fill="#fff" fillOpacity="0.15" />
            <rect x="17" y="16" width="5" height="16" rx="2" fill="#fff" />
            <rect x="26" y="16" width="5" height="16" rx="2" fill="#fff" />
          </svg>
        )}
      </button>
      <div className="overflow-hidden rounded-2xl shadow-lg" style={{height: 'min(46.8vh, 375px)'}}>
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-2 border-gray-900 hover:scale-110 hover:bg-gray-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 z-10 group"
          aria-label="Previous Slide"
          disabled={images.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-2 border-gray-900 hover:scale-110 hover:bg-gray-700 hover:text-white active:scale-95 active:shadow-lg transition-all duration-200 z-10 group"
          aria-label="Next Slide"
          disabled={images.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        {images.length > 0 && (
          <img
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="w-full h-full object-cover transition-all duration-700"
            style={{maxHeight: '46.8vh'}}
          />
        )}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-blue-200"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            disabled={images.length === 0}
          />
        ))}
      </div>
    </div>
  );
}

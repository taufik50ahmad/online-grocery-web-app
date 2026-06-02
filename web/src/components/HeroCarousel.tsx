import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "../data/banner";

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const banner = banners[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function nextBanner() {
    setActiveIndex((current) => (current + 1) % banners.length);
  }

  function previousBanner() {
    setActiveIndex((current) => (current - 1 + banners.length) % banners.length);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-red-600 via-red-500 to-orange-400 p-6 text-white shadow-xl shadow-red-100 md:p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-yellow-300/20" />

        <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wide">
              {banner.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{banner.title}</h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/90 md:text-base">{banner.description}</p>
            <button className="mt-7 rounded-2xl bg-white px-6 py-3 text-sm font-black text-red-600 shadow-lg">
              {banner.cta}
            </button>
          </div>

          <div className="grid place-items-center rounded-4xl bg-white/15 p-8 text-8xl md:text-9xl">
            {banner.emoji}
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {banners.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={previousBanner} className="rounded-full bg-white/20 p-2 hover:bg-white/30"><ChevronLeft size={18} /></button>
            <button onClick={nextBanner} className="rounded-full bg-white/20 p-2 hover:bg-white/30"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

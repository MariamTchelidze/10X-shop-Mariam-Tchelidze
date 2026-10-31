import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  { src: "/images/Dark-side-warriors-at-the-bazaar.png", alt: "Dark-side warriors among the Middle-earth bazaar stalls", position: "center 42%" },
  { src: "/images/dwarves-at-the-bazaar.png", alt: "Dwarves exploring a bazaar of handcrafted wares", position: "center 45%" },
  { src: "/images/Wizards-at-the-bazaar.png", alt: "Wizards at a lantern-lit bazaar", position: "center 40%" },
  { src: "/images/Hoobits-at-bazaar.png", alt: "Hobbits browsing a lively village bazaar", position: "center 45%" },
  { src: "/images/men-at-the-bazaar.png", alt: "Travelers at a Middle-earth bazaar", position: "center 45%" },
] as const;

const treasures = [
  ["THE ONE RING REPLICA", "the one ring replica"],
  ["NAZGÛL CLOAK", "nazgul cloak"],
  ["SAURON HOODIE", "sauron hoodie"],
  ["MORDOR MUG", "mordor mug"],
] as const;

const AUTOPLAY_INTERVAL = 5000;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const showPrevious = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % slides.length);

  return (
    <section
      aria-label="Treasures of Middle-earth featured collection"
      aria-roledescription="carousel"
      className="relative mb-9 h-[520px] overflow-hidden bg-market-ink sm:mb-12 sm:h-[560px] lg:h-[620px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      {slides.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          aria-hidden={index !== activeIndex}
          fetchPriority={index === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: slide.position }}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-16 pt-24 text-white sm:px-10 sm:pb-20 lg:px-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#e5d2a4] sm:text-xs">A MARKET BEYOND THE SHIRE</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight sm:text-5xl lg:text-6xl">Treasures of Middle-earth</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">Artifacts, apparel, and keepsakes for every road through the realm.</p>
        <nav aria-label="Featured treasures" className="mt-6 flex max-w-4xl flex-wrap gap-x-5 gap-y-3 sm:gap-x-7">
          {treasures.map(([label, query]) => (
            <Link key={query} to={`/?q=${encodeURIComponent(query)}&page=1`} className="border-b border-white/60 pb-1 text-[9px] font-medium uppercase tracking-[0.11em] text-white transition-colors hover:border-[#e5d2a4] hover:text-[#e5d2a4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[10px]">
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-6 sm:right-8">
        <button type="button" aria-label="Previous slide" onClick={showPrevious} className="inline-flex h-9 w-9 items-center justify-center border border-white/60 bg-black/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">‹</button>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose featured slide">
          {slides.map((slide, index) => (
            <button key={slide.src} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} className={`h-2.5 rounded-full border border-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === activeIndex ? "w-6 bg-white" : "w-2.5 bg-white/30 hover:bg-white/70"}`} />
          ))}
        </div>
        <button type="button" aria-label="Next slide" onClick={showNext} className="inline-flex h-9 w-9 items-center justify-center border border-white/60 bg-black/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">›</button>
      </div>
      <p className="sr-only" aria-live="polite">Slide {activeIndex + 1} of {slides.length}</p>
    </section>
  );
}

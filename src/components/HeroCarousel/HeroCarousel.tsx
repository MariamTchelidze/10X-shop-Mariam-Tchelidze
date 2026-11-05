// მთავარ გვერდზე ოპტიმიზებულ სურათებს, სლაიდის კონტროლებსა და კოლექციის ბმულებს აჩვენებს.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductImage } from "../ProductImage/ProductImage";

const slides = [
  { src: "/images/Dark-side-warriors-at-the-bazaar.jpg", alt: "Dark-side warriors among the Middle-earth bazaar stalls", position: "center 42%" },
  { src: "/images/dwarves-at-the-bazaar.jpg", alt: "Dwarves exploring a bazaar of handcrafted wares", position: "center 45%" },
  { src: "/images/Wizards-at-the-bazaar.jpg", alt: "Wizards at a lantern-lit bazaar", position: "center 40%" },
  { src: "/images/Hoobits-at-bazaar.jpg", alt: "Hobbits browsing a lively village bazaar", position: "center 45%" },
  { src: "/images/men-at-the-bazaar.jpg", alt: "Travelers at a Middle-earth bazaar", position: "center 45%" },
] as const;

const treasures = [
  ["THE ONE RING REPLICA", "the one ring replica"],
  ["NAZGÛL CLOAK", "nazgul cloak"],
  ["SAURON HOODIE", "sauron hoodie"],
  ["MORDOR MUG", "mordor mug"],
] as const;

const TRANSITION_DURATION_MS = 800;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // ერთ სლაიდს ვტოვებთ ეკრანზე, რომ სურათების ზედმეტი ჩამოტვირთვა თავიდან ავიცილოთ.
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(activeIndex);
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, isPaused]);

  useEffect(() => {
    if (previousIndex === null) return;
    const timeoutId = window.setTimeout(() => setPreviousIndex(null), TRANSITION_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, previousIndex]);

  // სლაიდის შეცვლისას ძველ კადრსაც მოკლედ ვინარჩუნებთ, რათა fade ეფექტი გამოჩნდეს.
  const goToSlide = (nextIndex: number): void => {
    if (nextIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
  };

  const showPrevious = (): void => goToSlide((activeIndex - 1 + slides.length) % slides.length);
  const showNext = (): void => goToSlide((activeIndex + 1) % slides.length);
  const nextIndex = (activeIndex + 1) % slides.length;
  const visibleIndexes = Array.from(new Set([
    ...(previousIndex === null ? [activeIndex] : [previousIndex, activeIndex]),
    nextIndex,
  ]));

  return (
    <section
      aria-label="Treasures of Middle-earth featured collection"
      aria-roledescription="carousel"
      className="relative mb-9 h-[470px] overflow-hidden bg-market-ink sm:mb-12 sm:h-[560px] lg:h-[620px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      {visibleIndexes.map((index) => {
        const slide = slides[index];
        return (
          <ProductImage
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1672}
            height={941}
            loading={index === activeIndex || index === nextIndex ? "eager" : "lazy"}
            fetchPriority={index === activeIndex ? "high" : "auto"}
            ariaHidden={index !== activeIndex}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: slide.position }}
          />
        );
      })}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[4.25rem] pt-20 text-white sm:px-10 sm:pb-20 lg:px-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#e5d2a4] sm:text-xs">A MARKET BEYOND THE SHIRE</p>
        <h1 className="mt-3 whitespace-nowrap font-display text-xl leading-tight sm:text-2xl md:text-4xl lg:text-6xl">Treasures of Middle-earth</h1>
        <p className="mt-4 hidden max-w-xl text-sm leading-6 text-white/85 min-[769px]:block sm:text-base">Artifacts, apparel, and keepsakes for every road through the realm.</p>
        <nav aria-label="Featured treasures" className="mt-3 grid w-fit max-w-full grid-cols-2 gap-x-5 gap-y-0 sm:mt-6 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
          {treasures.map(([label, query]) => (
            <Link
              key={query}
              to={`/?q=${encodeURIComponent(query)}&page=1`}
              className="inline-flex min-h-11 w-fit max-w-full items-center whitespace-nowrap border-b border-white/60 px-1 pb-1 text-[8px] font-medium uppercase tracking-[0.07em] text-white transition-colors hover:border-[#e5d2a4] hover:text-[#e5d2a4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white min-[400px]:text-[9px] min-[400px]:tracking-[0.1em] sm:text-[10px] sm:tracking-[0.11em]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute inset-x-4 bottom-2 z-20 flex items-center justify-between sm:inset-x-8 sm:bottom-6">
        <button type="button" aria-label="Previous slide" onClick={showPrevious} className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/60 bg-black/35 text-xl text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">‹</button>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center" role="group" aria-label="Choose featured slide">
          {slides.map((slide, index) => (
            <button key={slide.src} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => goToSlide(index)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span aria-hidden="true" className={`h-2.5 rounded-full border border-white transition-all ${index === activeIndex ? "w-6 bg-white" : "w-2.5 bg-white/30 hover:bg-white/70"}`} />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next slide" onClick={showNext} className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/60 bg-black/35 text-xl text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">›</button>
      </div>
      <p className="sr-only" aria-live="polite">Slide {activeIndex + 1} of {slides.length}</p>
    </section>
  );
}

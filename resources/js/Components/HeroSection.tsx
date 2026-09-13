import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Pause, Play } from "lucide-react";
import { getWhatsAppLink, useSiteConfig } from "@/config/site";

export type HeroSlideData = {
  id: number;
  eyebrow: string | null;
  title: string;
  description: string | null;
  image: string;
  imageAlt: string;
  imagePosition: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string | null;
  secondaryUrl: string | null;
};

export function HeroSection({ slides }: { slides: HeroSlideData[] }) {
  const site = useSiteConfig();
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = slides.length;
  const autoplayPaused = userPaused || interactionPaused || reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (autoplayPaused || count < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [autoplayPaused, count]);

  useEffect(() => {
    if (active >= count && count > 0) setActive(0);
  }, [active, count]);

  if (!count) return null;

  const go = (index: number) => setActive((index + count) % count);

  return (
    <section
      className="relative isolate min-h-[38rem] overflow-hidden sm:min-h-[42rem] lg:min-h-[46rem]"
      aria-roledescription="carousel"
      aria-label="Featured experiences"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocus={() => setInteractionPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(distance) > 50) go(active + (distance < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      {slides.map((slide, index) => (
        <article key={slide.id} aria-hidden={active !== index} inert={active !== index} className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-1000 motion-safe:ease-out ${active === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}>
          <img src={slide.image} alt={slide.imageAlt} className={`h-full w-full object-cover ${positionClass(slide.imagePosition)} motion-safe:transition-transform motion-safe:duration-[7000ms] motion-safe:ease-out ${active === index ? "motion-safe:scale-105" : "scale-100"}`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10182d]/90 via-[#10182d]/58 to-[#10182d]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10182d]/65 via-transparent to-[#10182d]/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
              <div className={`max-w-3xl text-white motion-safe:transition-all motion-safe:delay-200 motion-safe:duration-700 ${active === index ? "translate-y-0 opacity-100" : "motion-safe:translate-y-5 opacity-0"}`}>
                {slide.eyebrow && <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide backdrop-blur-sm md:text-sm">{slide.eyebrow}</span>}
                {active === index
                  ? <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] sm:text-5xl md:text-6xl lg:text-7xl">{slide.title}</h1>
                  : <h2 className="mt-5 font-display text-4xl font-bold leading-[1.04] sm:text-5xl md:text-6xl lg:text-7xl">{slide.title}</h2>}
                {slide.description && <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">{slide.description}</p>}
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={slide.primaryUrl} className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 font-bold text-foreground transition hover:brightness-95">
                    {slide.primaryLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                  {slide.secondaryLabel && slide.secondaryUrl && (
                    <a href={slide.secondaryUrl === "whatsapp" ? getWhatsAppLink(undefined, site) : slide.secondaryUrl} target={slide.secondaryUrl === "whatsapp" ? "_blank" : undefined} rel={slide.secondaryUrl === "whatsapp" ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20">
                      {slide.secondaryUrl === "whatsapp" && <MessageCircle className="h-4 w-4" />}{slide.secondaryLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-7 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2" role="tablist" aria-label="Choose hero slide">
              {slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => go(index)} aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-selected={active === index} role="tab" className={`h-2 rounded-full transition-all ${active === index ? "w-9 bg-[var(--gold)]" : "w-2 bg-white/55 hover:bg-white"}`} />)}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setUserPaused((paused) => !paused)} aria-label={userPaused ? "Play hero slideshow" : "Pause hero slideshow"} aria-pressed={userPaused} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur transition hover:bg-white hover:text-[var(--ocean)]">
                {userPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
              </button>
              <button type="button" onClick={() => go(active - 1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur transition hover:bg-white hover:text-[var(--ocean)]"><ArrowLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => go(active + 1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur transition hover:bg-white hover:text-[var(--ocean)]"><ArrowRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function positionClass(position: string) {
  return {
    left: "object-left",
    right: "object-right",
    top: "object-top",
    bottom: "object-bottom",
    center: "object-center",
  }[position] ?? "object-center";
}

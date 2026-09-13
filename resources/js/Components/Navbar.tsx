import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ChevronDown, Compass, Menu, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "./AppLink";
import { MobileMenu } from "./MobileMenu";
import { getWhatsAppLink, useSiteConfig } from "@/config/site";

export type NavigationCategory = {
  name: string;
  slug: string;
  description: string | null;
  count: number;
};

const navItems = [
  { label: "Home", to: "/" },
  { label: "Safaris", to: "/safaris" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const page = usePage<{ navigation?: { categories: NavigationCategory[] } }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const site = useSiteConfig();
  const currentPath = page.url.split("?")[0];
  const categories = page.props.navigation?.categories ?? [];

  useEffect(() => {
    setToursOpen(false);
    setMobileOpen(false);
  }, [currentPath]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setToursOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const active = (to: string) => to.includes("#") ? false : to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 shadow-[0_1px_12px_rgb(20_33_61/0.05)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
            <Link to="/" className="flex shrink-0 items-center gap-2" aria-label={`${site.name} home`}>
              <img src={site.logoPath} alt={site.name} className="h-14 w-auto object-contain lg:h-[4.5rem]" />
              <span className="hidden leading-none lg:block">
                <strong className="block font-display text-xl font-bold text-[var(--ocean)]">Malta</strong>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-foreground/55">Tour &amp; Safari</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              <NavLink label="Home" to="/" selected={active("/")} />

              <div ref={dropdownRef} className="relative">
                <button type="button" onClick={() => setToursOpen((open) => !open)} onMouseEnter={() => setToursOpen(true)} aria-expanded={toursOpen} aria-haspopup="true" className={`inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${currentPath.startsWith("/tours") ? "bg-[var(--ocean)]/7 text-[var(--ocean)]" : "text-foreground/70 hover:bg-slate-50 hover:text-[var(--ocean)]"}`}>
                  Tours <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toursOpen ? "rotate-180" : ""}`} />
                </button>
                {toursOpen && (
                  <div onMouseLeave={() => setToursOpen(false)} className="absolute left-1/2 top-full w-[42rem] -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgb(20_33_61/0.35)]">
                      <div className="grid grid-cols-[1fr_15rem]">
                        <div className="p-4">
                          <div className="flex items-center justify-between px-2 pb-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Explore by category</p>
                            <Link to="/tours" className="text-xs font-bold text-[var(--ocean)] hover:underline">View all tours</Link>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {categories.map((category) => (
                              <Link key={category.slug} to={`/tours?category=${category.slug}`} className="group rounded-xl p-3 transition hover:bg-slate-50">
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-[var(--ocean)]"><Compass className="h-4 w-4 text-[var(--turquoise)]" />{category.name}</span>
                                <span className="mt-1 block line-clamp-1 pl-6 text-xs text-slate-400">{category.count} experiences</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="bg-[var(--ocean)] p-5 text-white">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gold)] text-[var(--ocean)]"><Sparkles className="h-5 w-5" /></span>
                          <h3 className="mt-4 font-display text-xl font-bold">Not sure what to choose?</h3>
                          <p className="mt-2 text-xs leading-5 text-white/65">Tell our local team what you enjoy and we will suggest the right experience.</p>
                          <a href={getWhatsAppLink(undefined, site)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white"><MessageCircle className="h-4 w-4" /> Ask our team</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navItems.slice(1).map((item) => <NavLink key={item.label} {...item} selected={active(item.to)} />)}
            </nav>

            <div className="flex items-center gap-2">
              <a href={getWhatsAppLink(undefined, site)} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-xl border border-[#25D366]/25 bg-[#25D366]/10 px-3.5 py-2.5 text-sm font-bold text-[#159447] transition hover:bg-[#25D366] hover:text-white sm:inline-flex">
                <MessageCircle className="h-4 w-4" /><span className="hidden xl:inline">WhatsApp</span>
              </a>
              <Link to="/tours" className="hidden rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:brightness-95 md:inline-flex">Book a tour</Link>
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-white text-[var(--ocean)] lg:hidden"><Menu className="h-6 w-6" /></button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={navItems} categories={categories} currentPath={currentPath} />
    </>
  );
}

function NavLink({ label, to, selected }: { label: string; to: string; selected: boolean }) {
  return <Link to={to} className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selected ? "bg-[var(--ocean)]/7 text-[var(--ocean)]" : "text-foreground/70 hover:bg-slate-50 hover:text-[var(--ocean)]"}`}>{label}{selected && <span className="absolute inset-x-4 -bottom-[1.28rem] h-0.5 rounded-full bg-[var(--gold)]" />}</Link>;
}

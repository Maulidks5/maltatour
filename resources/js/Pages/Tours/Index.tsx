import { FormEvent, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Footer } from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
import { SectionHeading } from "@/Components/SectionHeading";
import { TourCard } from "@/Components/TourCard";
import { WhatsAppFloatingButton } from "@/Components/WhatsAppFloatingButton";
import type { TourCardData } from "@/types/tour";

type Props = {
  tours: {
    data: TourCardData[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  categories: Array<{ name: string; slug: string }>;
  filters: { q: string; category: string | null; type: string | null; sort: string };
  isSafari: boolean;
  basePath: string;
  eyebrow: string;
  pageTitle: string;
  pageDescription: string;
};

export default function ToursIndex({ tours, categories, filters, isSafari, basePath, eyebrow, pageTitle, pageDescription }: Props) {
  const [search, setSearch] = useState(filters.q);
  const hasFilters = Boolean(filters.q || filters.category || filters.type || filters.sort !== "recommended");

  function href(changes: Record<string, string | null>) {
    const params = new URLSearchParams();
    const values = { q: filters.q, category: filters.category, type: filters.type, sort: filters.sort, ...changes };
    Object.entries(values).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "recommended")) params.set(key, value);
    });
    const query = params.toString();
    return `${basePath}${query ? `?${query}` : ""}`;
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.get(basePath, { q: search || undefined, category: filters.category || undefined, type: filters.type || undefined, sort: filters.sort }, { preserveState: true, preserveScroll: true });
  }
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={pageDescription}
        />
      </Head>

      <Navbar />
      <main>
        <section className="bg-[var(--ocean)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold md:text-6xl">
              {pageTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
              {pageDescription}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={isSafari ? "Safari collection" : "Our experiences"}
            title={isSafari ? "Find your perfect Tanzania safari" : "Find your perfect Zanzibar tour"}
            subtitle={`${tours.total} ${tours.total === 1 ? "experience" : "experiences"} available`}
          />

          <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <form onSubmit={submitSearch} className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isSafari ? "Search safari packages or locations…" : "Search tours, activities or locations…"} className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-24 text-sm outline-none focus:border-[var(--ocean)]" />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--ocean)] px-4 py-2 text-xs font-bold text-white">Search</button>
              </form>
              {!isSafari && (
                <div className="flex gap-2">
                  {[
                    { label: "All types", value: null },
                    { label: "Tours", value: "zanzibar_tour" },
                    { label: "Water sports", value: "water_sport" },
                  ].map((type) => <Link key={type.label} href={href({ type: type.value })} preserveScroll className={`shrink-0 rounded-xl px-3.5 py-3 text-xs font-bold transition ${filters.type === type.value ? "bg-[var(--ocean)] text-white" : "border border-border bg-background text-foreground hover:border-[var(--ocean)]"}`}>{type.label}</Link>)}
                </div>
              )}
              <label className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={filters.sort} onChange={(event) => router.get(href({ sort: event.target.value }), {}, { preserveState: true, preserveScroll: true })} className="h-full min-h-11 rounded-xl border border-input bg-background py-3 pl-10 pr-9 text-xs font-bold outline-none">
                  <option value="recommended">Recommended</option>
                  <option value="price_low">Price: low to high</option>
                  <option value="price_high">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {!isSafari && <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <Link
              href={href({ category: null })}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                !filters.category
                  ? "bg-[var(--ocean)] text-white"
                  : "border border-border bg-card text-foreground hover:border-[var(--ocean)]"
              }`}
            >
              All tours
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={href({ category: category.slug })}
                preserveScroll
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filters.category === category.slug
                    ? "bg-[var(--ocean)] text-white"
                    : "border border-border bg-card text-foreground hover:border-[var(--ocean)]"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>}

          {tours.data.length > 0 ? (
            <>
            <div className="mb-5 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>Showing {tours.from}–{tours.to} of {tours.total}</span>
              {hasFilters && <Link href={basePath} className="inline-flex items-center gap-1 font-bold text-[var(--ocean)]"><X className="h-3.5 w-3.5" /> Clear filters</Link>}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.data.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
            </div>
            {tours.last_page > 1 && (
              <nav aria-label="Tour pages" className="mt-10 flex flex-wrap justify-center gap-2">
                {tours.links.map((link, index) => link.url
                  ? <Link key={index} href={link.url} preserveScroll className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${link.active ? "border-[var(--ocean)] bg-[var(--ocean)] text-white" : "border-border bg-card text-foreground hover:border-[var(--ocean)]"}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                  : <span key={index} className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground/40" dangerouslySetInnerHTML={{ __html: link.label }} />)}
              </nav>
            )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
              <h2 className="font-display text-2xl font-bold">No tours found</h2>
              <p className="mt-2 text-muted-foreground">Try a different search, category or service type.</p>
              <Link href={basePath} className="mt-6 inline-flex rounded-full bg-[var(--ocean)] px-5 py-2.5 font-semibold text-white">
                Clear all filters
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

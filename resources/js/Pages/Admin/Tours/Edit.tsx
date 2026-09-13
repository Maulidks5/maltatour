import { FormEvent } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminTourContentEditor } from "@/Components/AdminTourContentEditor";
import { AdminTourGalleryEditor } from "@/Components/AdminTourGalleryEditor";

type TourForm = {
  tour_category_id: number;
  experience_type: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  duration: string;
  location: string;
  price: number;
  currency: string;
  minimum_age: number | "";
  difficulty: string;
  pickup_details: string;
  meta_title: string;
  meta_description: string;
  cover_image: File | null;
  is_featured: boolean;
  is_popular: boolean;
  is_published: boolean;
};

type Props = {
  tour: TourForm & {
    id: number;
    cover_image_path: string | null;
    highlights: string[];
    included: string[];
    not_included: string[];
    itinerary: Array<{ time: string | null; title: string; description: string | null }>;
    images: Array<{ id: number; path: string; alt_text: string | null; sort_order: number }>;
  };
  categories: Array<{ id: number; name: string }>;
};

export default function AdminTourEdit({ tour, categories }: Props) {
  const { data, setData, post, processing, errors } = useForm<TourForm>({
    tour_category_id: tour.tour_category_id,
    experience_type: tour.experience_type,
    title: tour.title,
    slug: tour.slug,
    excerpt: tour.excerpt,
    description: tour.description,
    duration: tour.duration,
    location: tour.location,
    price: tour.price,
    currency: tour.currency,
    minimum_age: tour.minimum_age ?? "",
    difficulty: tour.difficulty ?? "",
    pickup_details: tour.pickup_details ?? "",
    meta_title: tour.meta_title ?? "",
    meta_description: tour.meta_description ?? "",
    cover_image: null,
    is_featured: tour.is_featured,
    is_popular: tour.is_popular,
    is_published: tour.is_published,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    post(`/admin/tours/${tour.slug}`, { forceFormData: true, preserveScroll: true });
  }

  return (
    <AdminLayout title={`Edit ${tour.title}`}>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ocean)]"><ArrowLeft className="h-4 w-4" /> All tours</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--turquoise)]">Content editor</p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{tour.title}</h1>
          <p className="mt-1 text-sm text-slate-500">Update tour information, visibility, SEO and media.</p>
        </div>
        <a href={`/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm">
          Preview page <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-6">
        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" error={errors.title}><input value={data.title} onChange={(e) => setData("title", e.target.value)} className={input} /></Field>
            <Field label="Slug" error={errors.slug}><input value={data.slug} onChange={(e) => setData("slug", e.target.value)} className={input} /></Field>
            <Field label="Category" error={errors.tour_category_id}>
              <select value={data.tour_category_id} onChange={(e) => setData("tour_category_id", Number(e.target.value))} className={input}>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
            <Field label="Experience type" error={errors.experience_type}>
              <select value={data.experience_type} onChange={(e) => setData("experience_type", e.target.value)} className={input}>
                <option value="zanzibar_tour">Zanzibar tour</option><option value="water_sport">Water sport</option><option value="safari">Safari</option>
              </select>
            </Field>
          </div>
          <Field label="Short description" error={errors.excerpt}><textarea rows={3} value={data.excerpt} onChange={(e) => setData("excerpt", e.target.value)} className={input} /></Field>
          <Field label="Full description" error={errors.description}><textarea rows={6} value={data.description} onChange={(e) => setData("description", e.target.value)} className={input} /></Field>
        </section>

        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3 md:p-7">
          <Field label="Duration" error={errors.duration}><input value={data.duration} onChange={(e) => setData("duration", e.target.value)} className={input} /></Field>
          <Field label="Location" error={errors.location}><input value={data.location} onChange={(e) => setData("location", e.target.value)} className={input} /></Field>
          <Field label="Price (0 = on request)" error={errors.price}><input type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData("price", Number(e.target.value))} className={input} /></Field>
          <Field label="Currency" error={errors.currency}>
            <select value={data.currency} onChange={(e) => setData("currency", e.target.value)} className={input}><option>USD</option><option>TZS</option><option>EUR</option></select>
          </Field>
          <Field label="Minimum age" error={errors.minimum_age}><input type="number" min="0" value={data.minimum_age} onChange={(e) => setData("minimum_age", e.target.value ? Number(e.target.value) : "")} className={input} /></Field>
          <Field label="Difficulty" error={errors.difficulty}>
            <select value={data.difficulty} onChange={(e) => setData("difficulty", e.target.value)} className={input}><option value="">Not applicable</option><option>Easy</option><option>Moderate</option><option>Advanced</option><option>Varies</option></select>
          </Field>
          <div className="md:col-span-3"><Field label="Pickup details" error={errors.pickup_details}><textarea rows={3} value={data.pickup_details} onChange={(e) => setData("pickup_details", e.target.value)} className={input} /></Field></div>
        </section>

        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
          {tour.cover_image_path && <img src={tour.cover_image_path} alt="" className="aspect-video max-w-md rounded-xl object-cover" />}
          <Field label="Replace cover image" error={errors.cover_image}><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData("cover_image", e.target.files?.[0] ?? null)} className={input} /></Field>
          <div className="flex flex-wrap gap-5">
            {[
              ["is_published", "Published"],
              ["is_popular", "Popular"],
              ["is_featured", "Featured"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={data[key as "is_published" | "is_popular" | "is_featured"]} onChange={(e) => setData(key as "is_published" | "is_popular" | "is_featured", e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
          <Field label="SEO title" error={errors.meta_title}><input value={data.meta_title} onChange={(e) => setData("meta_title", e.target.value)} className={input} /></Field>
          <Field label="SEO description" error={errors.meta_description}><textarea rows={3} value={data.meta_description} onChange={(e) => setData("meta_description", e.target.value)} className={input} /></Field>
        </section>

        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <p className="hidden pl-2 text-xs text-slate-500 sm:block">Save before editing structured content or gallery below.</p>
          <button disabled={processing} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[var(--ocean)] px-6 py-3 font-bold text-white disabled:opacity-60">
            <Save className="h-4 w-4" /> {processing ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <div className="my-10 h-px bg-slate-200" />
      <AdminTourContentEditor
        tourSlug={tour.slug}
        highlights={tour.highlights}
        included={tour.included}
        notIncluded={tour.not_included}
        itinerary={tour.itinerary}
      />

      <div className="my-10 h-px bg-slate-200" />
      <AdminTourGalleryEditor tourSlug={tour.slug} images={tour.images} />
    </AdminLayout>
  );
}

const input = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--turquoise)]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>{children}{error && <span className="text-xs text-red-600">{error}</span>}</label>;
}

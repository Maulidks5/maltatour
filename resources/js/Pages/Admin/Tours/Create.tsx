import { FormEvent } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ImagePlus, Save, Sparkles } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";

type Category = { id: number; name: string };

export default function CreateTour({ categories }: { categories: Category[] }) {
  const { data, setData, post, processing, errors } = useForm({
    tour_category_id: categories[0]?.id ?? 0,
    experience_type: "zanzibar_tour",
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    duration: "",
    location: "Zanzibar",
    price: 0,
    currency: "USD",
    minimum_age: "" as number | "",
    difficulty: "",
    pickup_details: "",
    meta_title: "",
    meta_description: "",
    cover_image: null as File | null,
    is_featured: false,
    is_popular: false,
    is_published: false,
  });

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    post("/admin/tours", { forceFormData: true });
  }

  return (
    <AdminLayout title="Add tour">
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ocean)]"><ArrowLeft className="h-4 w-4" /> All tours</Link>
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--turquoise)]">New catalogue item</p>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Add tour or service</h1>
        <p className="mt-1 text-sm text-slate-500">Create the essential information first. Highlights, itinerary and gallery can be added on the next screen.</p>
      </div>

      <form onSubmit={submit} className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid gap-6">
          <Section title="Basic information" description="The public name and description travellers will see.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tour title" error={errors.title}><input required value={data.title} onChange={(event) => { const title = event.target.value; setData((current) => ({ ...current, title, slug: slugify(title) })); }} className={input} placeholder="e.g. Stone Town Walking Tour" /></Field>
              <Field label="URL slug" error={errors.slug}><input required value={data.slug} onChange={(event) => setData("slug", slugify(event.target.value))} className={input} placeholder="stone-town-walking-tour" /></Field>
              <Field label="Category" error={errors.tour_category_id}><select value={data.tour_category_id} onChange={(event) => setData("tour_category_id", Number(event.target.value))} className={input}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
              <Field label="Experience type" error={errors.experience_type}><select value={data.experience_type} onChange={(event) => setData("experience_type", event.target.value)} className={input}><option value="zanzibar_tour">Zanzibar tour</option><option value="water_sport">Water sport</option><option value="safari">Tanzania safari</option></select></Field>
            </div>
            <Field label="Short card description" error={errors.excerpt}><textarea required rows={3} value={data.excerpt} onChange={(event) => setData("excerpt", event.target.value)} className={input} placeholder="A short, compelling summary for tour cards." /></Field>
            <Field label="Full description" error={errors.description}><textarea required rows={6} value={data.description} onChange={(event) => setData("description", event.target.value)} className={input} placeholder="Describe the experience, what guests will do and what makes it special." /></Field>
          </Section>

          <Section title="Trip details" description="Duration, location, pricing and guest requirements.">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Duration" error={errors.duration}><input required value={data.duration} onChange={(event) => setData("duration", event.target.value)} className={input} placeholder="Half Day" /></Field>
              <Field label="Location" error={errors.location}><input required value={data.location} onChange={(event) => setData("location", event.target.value)} className={input} /></Field>
              <Field label="Price (0 = on request)" error={errors.price}><input required type="number" min={0} step="0.01" value={data.price} onChange={(event) => setData("price", Number(event.target.value))} className={input} /></Field>
              <Field label="Currency" error={errors.currency}><select value={data.currency} onChange={(event) => setData("currency", event.target.value)} className={input}><option>USD</option><option>TZS</option><option>EUR</option></select></Field>
              <Field label="Minimum age" error={errors.minimum_age}><input type="number" min={0} value={data.minimum_age} onChange={(event) => setData("minimum_age", event.target.value ? Number(event.target.value) : "")} className={input} /></Field>
              <Field label="Difficulty" error={errors.difficulty}><select value={data.difficulty} onChange={(event) => setData("difficulty", event.target.value)} className={input}><option value="">Not applicable</option><option>Easy</option><option>Moderate</option><option>Advanced</option><option>Varies</option></select></Field>
            </div>
            <Field label="Pickup details" error={errors.pickup_details}><textarea rows={3} value={data.pickup_details} onChange={(event) => setData("pickup_details", event.target.value)} className={input} /></Field>
          </Section>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-24">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold">Cover & visibility</h2>
            <label className="mt-4 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <ImagePlus className="h-7 w-7 text-slate-400" /><span className="mt-2 text-xs font-bold text-[var(--ocean)]">{data.cover_image?.name ?? "Choose cover image"}</span><span className="mt-1 text-[10px] text-slate-400">JPG, PNG or WebP · max 5 MB</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setData("cover_image", event.target.files?.[0] ?? null)} />
            </label>
            {errors.cover_image && <span className="mt-2 block text-xs text-rose-600">{errors.cover_image}</span>}
            <div className="mt-5 grid gap-3">
              <Toggle label="Publish immediately" checked={data.is_published} onChange={(checked) => setData("is_published", checked)} />
              <Toggle label="Mark as popular" checked={data.is_popular} onChange={(checked) => setData("is_popular", checked)} />
              <Toggle label="Feature on homepage" checked={data.is_featured} onChange={(checked) => setData("is_featured", checked)} />
            </div>
          </section>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800"><Sparkles className="mb-2 h-5 w-5" />New tours start as drafts unless “Publish immediately” is enabled.</div>
          <button disabled={processing || !categories.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ocean)] px-6 py-3.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{processing ? "Creating…" : "Create tour"}</button>
        </aside>
      </form>
    </AdminLayout>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div><h2 className="font-display text-xl font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>{children}</section>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" /></label>;
}
const input = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--turquoise)]";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>{children}{error && <span className="text-xs text-rose-600">{error}</span>}</label>;
}

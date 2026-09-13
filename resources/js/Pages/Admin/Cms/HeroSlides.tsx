import { FormEvent, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Eye, EyeOff, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminPageHeader } from "@/Components/AdminUi";

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  imagePosition: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export default function HeroSlides({ slides }: { slides: Slide[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <AdminLayout title="Hero slider">
      <AdminPageHeader eyebrow="Homepage visual" title="Hero slider" description="Show 3–4 strong services. The first active slide is loaded first for best performance." actions={
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--ocean)] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add slide</button>
      } />

      {creating && <div className="mt-6"><SlideEditor onCancel={() => setCreating(false)} nextOrder={slides.length} /></div>}
      <div className="mt-6 grid gap-5">
        {slides.map((slide) => <SlideEditor key={slide.id} slide={slide} />)}
      </div>
    </AdminLayout>
  );
}

function SlideEditor({ slide, nextOrder = 0, onCancel }: { slide?: Slide; nextOrder?: number; onCancel?: () => void }) {
  const { data, setData, post, processing, errors } = useForm({
    eyebrow: slide?.eyebrow ?? "",
    title: slide?.title ?? "",
    description: slide?.description ?? "",
    image_alt: slide?.imageAlt ?? "",
    image_position: slide?.imagePosition ?? "center",
    primary_label: slide?.primaryLabel ?? "Explore Tours",
    primary_url: slide?.primaryUrl ?? "/tours",
    secondary_label: slide?.secondaryLabel ?? "Chat on WhatsApp",
    secondary_url: slide?.secondaryUrl ?? "whatsapp",
    sort_order: slide?.sortOrder ?? nextOrder,
    is_active: slide?.isActive ?? true,
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    post(slide ? `/admin/cms/hero-slides/${slide.id}` : "/admin/cms/hero-slides", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => onCancel?.(),
    });
  }

  function remove() {
    if (slide && window.confirm(`Remove “${slide.title}” from the hero slider?`)) {
      router.delete(`/admin/cms/hero-slides/${slide.id}`, { preserveScroll: true });
    }
  }

  return (
    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
        <label className="group relative min-h-64 cursor-pointer bg-slate-100">
          {(preview || slide?.imagePath) ? <img src={preview ?? slide?.imagePath} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
          <span className="absolute inset-0 grid place-items-center bg-slate-950/30 text-white transition group-hover:bg-slate-950/45"><span className="inline-flex items-center gap-2 rounded-xl bg-black/35 px-4 py-2 text-xs font-bold backdrop-blur"><ImagePlus className="h-4 w-4" />{data.image ? data.image.name : "Choose slide image"}</span></span>
          <input required={!slide} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setData("image", file);
            if (file) setPreview(URL.createObjectURL(file));
          }} />
        </label>

        <div className="grid gap-4 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Small heading" error={errors.eyebrow}><input value={data.eyebrow} onChange={(event) => setData("eyebrow", event.target.value)} className={input} /></Field>
            <Field label="Display order" error={errors.sort_order}><input type="number" min={0} value={data.sort_order} onChange={(event) => setData("sort_order", Number(event.target.value))} className={input} /></Field>
          </div>
          <Field label="Main heading" error={errors.title}><input required value={data.title} onChange={(event) => setData("title", event.target.value)} className={input} /></Field>
          <Field label="Description" error={errors.description}><textarea rows={3} value={data.description} onChange={(event) => setData("description", event.target.value)} className={input} /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary button label" error={errors.primary_label}><input required value={data.primary_label} onChange={(event) => setData("primary_label", event.target.value)} className={input} /></Field>
            <Field label="Primary button URL" error={errors.primary_url}><input required value={data.primary_url} onChange={(event) => setData("primary_url", event.target.value)} className={input} /></Field>
            <Field label="Secondary button label" error={errors.secondary_label}><input value={data.secondary_label} onChange={(event) => setData("secondary_label", event.target.value)} className={input} /></Field>
            <Field label="Secondary URL" error={errors.secondary_url}><input value={data.secondary_url} onChange={(event) => setData("secondary_url", event.target.value)} placeholder="whatsapp or /contact" className={input} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Image alternative text" error={errors.image_alt}><input value={data.image_alt} onChange={(event) => setData("image_alt", event.target.value)} className={input} /></Field>
            <Field label="Image focus" error={errors.image_position}>
              <select value={data.image_position} onChange={(event) => setData("image_position", event.target.value)} className={input}>
                <option value="center">Center</option><option value="left">Left</option><option value="right">Right</option><option value="top">Top</option><option value="bottom">Bottom</option>
              </select>
            </Field>
          </div>
          {errors.image && <span className="text-xs text-rose-600">{errors.image}</span>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <button type="button" onClick={() => setData("is_active", !data.is_active)} className={`inline-flex items-center gap-2 text-xs font-bold ${data.is_active ? "text-emerald-700" : "text-slate-500"}`}>{data.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{data.is_active ? "Visible" : "Hidden"}</button>
        <div className="flex gap-2">
          {slide && <button type="button" onClick={remove} className="grid h-10 w-10 place-items-center rounded-xl text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>}
          {onCancel && <button type="button" onClick={onCancel} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"><X className="h-4 w-4" /> Cancel</button>}
          <button disabled={processing} className="inline-flex items-center gap-2 rounded-xl bg-[var(--ocean)] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{processing ? "Saving…" : slide ? "Save slide" : "Create slide"}</button>
        </div>
      </div>
    </form>
  );
}

const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--turquoise)]";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>{children}{error && <span className="text-xs text-rose-600">{error}</span>}</label>;
}

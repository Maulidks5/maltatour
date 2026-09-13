import { FormEvent } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { CalendarDays, Check, Clock, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import { Footer } from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
import { WhatsAppFloatingButton } from "@/Components/WhatsAppFloatingButton";

type TourSummary = {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  location: string;
  price: number;
  currency: string;
  image: string;
};

type Props = {
  tour: TourSummary;
};

type BookingFormData = {
  tour_id: number;
  full_name: string;
  email: string;
  whatsapp: string;
  travel_date: string;
  adults: number;
  children: number;
  hotel: string;
  special_requests: string;
  consent: boolean;
  website: string;
};

export default function BookingCreate({ tour }: Props) {
  const { data, setData, post, processing, errors } = useForm<BookingFormData>({
    tour_id: tour.id,
    full_name: "",
    email: "",
    whatsapp: "",
    travel_date: "",
    adults: 2,
    children: 0,
    hotel: "",
    special_requests: "",
    consent: false,
    website: "",
  });
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: tour.currency,
    maximumFractionDigits: 0,
  }).format(tour.price);
  const priceLabel = tour.price > 0 ? price : "Contact for price";
  const today = new Date().toISOString().slice(0, 10);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    post("/bookings", {
      preserveScroll: true,
      onError: () => {
        window.setTimeout(() => {
          document.getElementById("booking-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      },
    });
  }

  const errorMessages = Object.values(errors);

  return (
    <div className="min-h-screen bg-[var(--sand)]/45">
      <Head title={`Book ${tour.title}`}>
        <meta name="description" content={`Send a booking request for ${tour.title} with Malta Tours and Safari.`} />
      </Head>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <Link href={`/tours/${tour.slug}`} className="text-sm font-semibold text-[var(--ocean)] hover:underline">
          ← Back to tour details
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--turquoise)]">Booking request</p>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Plan your experience</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Send your preferred date and group details. Our local team will confirm availability, pickup time and final arrangements.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-[var(--sand)]/70 p-3 text-center text-xs font-semibold text-muted-foreground">
              <span><strong className="mr-1 text-[var(--ocean)]">1.</strong> Your details</span>
              <span><strong className="mr-1 text-[var(--ocean)]">2.</strong> Trip details</span>
              <span><strong className="mr-1 text-[var(--ocean)]">3.</strong> Confirmation</span>
            </div>

            {errorMessages.length > 0 && (
              <div id="booking-errors" role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-bold">Please correct the following before sending:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {errorMessages.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}
                </ul>
              </div>
            )}

            <form onSubmit={submit} className="mt-8 grid gap-5">
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.website}
                    onChange={(event) => setData("website", event.target.value)}
                  />
                </label>
              </div>
              <div>
                <p className="font-display text-xl font-bold">Your contact details</p>
                <p className="mt-1 text-xs text-muted-foreground">We use these details only to confirm this request.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.full_name}>
                  <input
                    value={data.full_name}
                    onChange={(event) => setData("full_name", event.target.value)}
                    autoComplete="name"
                    required
                    className={inputClass(errors.full_name)}
                    placeholder="Your full name"
                  />
                </Field>

                <Field label="WhatsApp number" error={errors.whatsapp}>
                  <input
                    value={data.whatsapp}
                    onChange={(event) => setData("whatsapp", event.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    className={inputClass(errors.whatsapp)}
                    placeholder="+255 ..."
                  />
                </Field>

                <Field label="Email (optional)" error={errors.email}>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(event) => setData("email", event.target.value)}
                    autoComplete="email"
                    className={inputClass(errors.email)}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <div className="mt-2 border-t border-border pt-6">
                <p className="font-display text-xl font-bold">Trip details</p>
                <p className="mt-1 text-xs text-muted-foreground">Choose your preferred date and group size.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Travel date" error={errors.travel_date}>
                  <input
                    type="date"
                    min={today}
                    value={data.travel_date}
                    onChange={(event) => setData("travel_date", event.target.value)}
                    required
                    className={inputClass(errors.travel_date)}
                  />
                </Field>

                <div className="hidden sm:block" />
                <GuestCounter label="Adults" value={data.adults} min={1} max={30} error={errors.adults} onChange={(value) => setData("adults", value)} />
                <GuestCounter label="Children" hint="Ages 0–12" value={data.children} min={0} max={20} error={errors.children} onChange={(value) => setData("children", value)} />
              </div>

              <Field label="Hotel or pickup location (optional)" error={errors.hotel}>
                <input
                  value={data.hotel}
                  onChange={(event) => setData("hotel", event.target.value)}
                  className={inputClass(errors.hotel)}
                  placeholder="Hotel name or area"
                />
              </Field>

              <Field label="Special requests (optional)" error={errors.special_requests}>
                <textarea
                  rows={4}
                  value={data.special_requests}
                  onChange={(event) => setData("special_requests", event.target.value)}
                  className={inputClass(errors.special_requests)}
                  placeholder="Private tour, dietary needs, accessibility or anything else we should know"
                />
              </Field>

              <div className="rounded-xl bg-[var(--sand)]/70 p-4 text-sm text-muted-foreground">
                No online payment is required. This form sends a booking request; our team will confirm availability with you.
              </div>

              <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(event) => setData("consent", event.target.checked)}
                  required
                  className="mt-1"
                />
                <span>I agree that Malta Tours and Safari may use these details to contact me about this booking request.</span>
              </label>
              {errors.consent && <span className="-mt-3 text-xs font-medium text-red-600">{errors.consent}</span>}

              <button
                type="submit"
                disabled={processing}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ocean)] px-6 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Sending request…" : "Send booking request"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                You will receive a booking reference immediately after submitting.
              </p>
            </form>
          </section>

          <aside className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] lg:sticky lg:top-28">
            <img src={tour.image} alt={tour.title} className="aspect-[4/3] w-full object-cover" />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--turquoise)]">Your tour</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{tour.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tour.description}</p>
              <div className="mt-5 space-y-3 border-y border-border py-5 text-sm">
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--turquoise)]" /> {tour.duration}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--turquoise)]" /> {tour.location}</p>
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[var(--turquoise)]" /> Flexible date confirmation</p>
              </div>
              {(data.travel_date || data.adults > 0) && <div className="mt-5 rounded-xl bg-[var(--sand)]/70 p-4 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your request</p>
                <p className="mt-2 font-semibold">{data.travel_date ? new Date(`${data.travel_date}T12:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "Date not selected"}</p>
                <p className="mt-1 text-muted-foreground">{data.adults} {data.adults === 1 ? "adult" : "adults"}{data.children > 0 ? ` · ${data.children} ${data.children === 1 ? "child" : "children"}` : ""}</p>
              </div>}
              <p className="mt-5 text-sm text-muted-foreground">From</p>
              <p className="font-display text-3xl font-bold text-[var(--ocean)]">
                {priceLabel}{tour.price > 0 && <span className="text-sm font-medium text-muted-foreground"> / person</span>}
              </p>
              <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--turquoise)]" />
                Your details are used only to arrange this booking.
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

function GuestCounter({
  label,
  hint,
  value,
  min,
  max,
  error,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  error?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-foreground/75">{label}</span>
      <div className={`flex min-h-12 items-center justify-between rounded-xl border bg-background px-2 ${error ? "border-red-500" : "border-input"}`}>
        <div className="px-2">
          <span className="text-sm font-semibold">{label}</span>
          {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Remove one ${label.toLowerCase()}`} className="grid h-8 w-8 place-items-center rounded-full border border-border text-[var(--ocean)] disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
          <output className="w-5 text-center text-sm font-bold">{value}</output>
          <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Add one ${label.toLowerCase()}`} className="grid h-8 w-8 place-items-center rounded-full border border-border text-[var(--ocean)] disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-foreground/75">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--turquoise)]/25 ${
    error ? "border-red-500" : "border-input focus:border-[var(--turquoise)]"
  }`;
}

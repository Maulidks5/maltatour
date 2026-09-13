import { FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import { Footer } from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
import { getWhatsAppLink, useSiteConfig } from "@/config/site";

type Props = {
  content: { eyebrow: string; title: string; description: string };
};

export default function Contact({ content }: Props) {
  const site = useSiteConfig();
  const form = useForm({ name: "", email: "", subject: "", message: "", website: "" });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.post("/contact", { preserveScroll: true, onSuccess: () => form.reset() });
  }

  return (
    <div className="min-h-screen bg-[var(--sand)]/35">
      <Head title={`Contact ${site.name}`}>
        <meta name="description" content={content.description} />
      </Head>
      <Navbar />
      <main>
        <section className="bg-[var(--ocean)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold md:text-6xl">{content.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 md:text-lg">{content.description}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[22rem_minmax(0,1fr)] lg:px-8">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <ContactCard icon={MessageCircle} label="WhatsApp" value={site.phone} href={getWhatsAppLink("Hello Malta Tours and Safari, I would like help planning a trip.", site)} accent />
            <ContactCard icon={Phone} label="Call us" value={site.phone} href={`tel:${site.phone.replace(/\s/g, "")}`} />
            <ContactCard icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
            <ContactCard icon={MapPin} label="Location" value={site.location} />
            <div className="rounded-2xl bg-[var(--ocean)] p-5 text-white">
              <Clock3 className="h-5 w-5 text-[var(--gold)]" />
              <p className="mt-3 font-bold">Quick local support</p>
              <p className="mt-1 text-xs leading-5 text-white/65">For the fastest response, contact our team directly on WhatsApp.</p>
            </div>
          </aside>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--turquoise)]">Send an inquiry</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Tell us about your trip</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Share as much as you know. Dates, group size and preferred tours help us give you a useful response.</p>

            {form.recentlySuccessful && <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Thank you. Your message has been sent to our team.</div>}
            {Object.keys(form.errors).length > 0 && <div role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">Please check the highlighted fields and try again.</div>}

            <form onSubmit={submit} className="mt-7 grid gap-5">
              <input tabIndex={-1} autoComplete="off" value={form.data.website} onChange={(event) => form.setData("website", event.target.value)} className="absolute -left-[10000px] h-px w-px" aria-hidden="true" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={form.errors.name}><input required autoComplete="name" value={form.data.name} onChange={(event) => form.setData("name", event.target.value)} placeholder="Your full name" className={inputClass(form.errors.name)} /></Field>
                <Field label="Email address" error={form.errors.email}><input required type="email" autoComplete="email" value={form.data.email} onChange={(event) => form.setData("email", event.target.value)} placeholder="you@example.com" className={inputClass(form.errors.email)} /></Field>
              </div>
              <Field label="What can we help with?" error={form.errors.subject}><input required value={form.data.subject} onChange={(event) => form.setData("subject", event.target.value)} placeholder="Example: Private Mnemba tour for four guests" className={inputClass(form.errors.subject)} /></Field>
              <Field label="Your message" error={form.errors.message}><textarea required rows={6} value={form.data.message} onChange={(event) => form.setData("message", event.target.value)} placeholder="Travel dates, number of guests, hotel and experiences you are interested in…" className={inputClass(form.errors.message)} /></Field>
              <div className="flex items-start gap-3 rounded-xl bg-[var(--sand)]/70 p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-[var(--turquoise)]" />Your details are used only to respond to this inquiry. No payment is required.</div>
              <button disabled={form.processing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ocean)] px-6 font-bold text-white transition hover:brightness-110 disabled:opacity-60"><Send className="h-4 w-4" />{form.processing ? "Sending message…" : "Send message"}</button>
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href, accent = false }: { icon: typeof Phone; label: string; value: string; href?: string; accent?: boolean }) {
  const body = <><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${accent ? "bg-[#25D366]/15 text-[#159447]" : "bg-[var(--turquoise)]/15 text-[var(--ocean)]"}`}><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-xs text-muted-foreground">{label}</span><span className="block break-words text-sm font-bold">{value}</span></span></>;
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-[var(--turquoise)]">{body}</a> : <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">{body}</div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-xs font-bold uppercase tracking-wider text-foreground/75">{label}</span>{children}{error && <span className="text-xs font-medium text-red-600">{error}</span>}</label>;
}

function inputClass(error?: string) {
  return `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--turquoise)]/25 ${error ? "border-red-500" : "border-input focus:border-[var(--turquoise)]"}`;
}

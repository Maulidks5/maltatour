import { Head, Link } from "@inertiajs/react";
import { Check, Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { Footer } from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
import { getWhatsAppLink, useSiteConfig } from "@/config/site";

type Props = {
  booking: {
    reference: string;
    tourTitle: string;
    tourSlug: string;
    travelDate: string;
    adults: number;
    children: number;
    quotedPrice: number | null;
    quotedCurrency: string | null;
  };
};

export default function BookingSuccess({ booking }: Props) {
  const site = useSiteConfig();
  const message = `Hello Malta Tours and Safari, I submitted booking request ${booking.reference} for ${booking.tourTitle} on ${booking.travelDate}.`;
  const quotedPrice = booking.quotedPrice && booking.quotedCurrency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: booking.quotedCurrency, maximumFractionDigits: 0 }).format(booking.quotedPrice)
    : null;

  return (
    <div className="min-h-screen bg-[var(--sand)]/45">
      <Head title="Booking request received" />
      <Navbar />
      <main className="mx-auto flex max-w-3xl items-center px-4 py-20 sm:px-6 md:min-h-[65vh]">
        <section className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-[var(--shadow-soft)] md:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--turquoise)]/15 text-[var(--turquoise)]">
            <Check className="h-8 w-8" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--turquoise)]">Request received</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Thank you for booking with us</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            We received your request for <strong className="text-foreground">{booking.tourTitle}</strong>. Our local team will check availability and contact you to confirm the details.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[var(--sand)]/70 p-5 text-left text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reference</span><strong>{booking.reference}</strong></div>
            <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Travel date</span><strong>{booking.travelDate}</strong></div>
            <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Guests</span><strong>{booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ""}</strong></div>
            {quotedPrice && <div className="mt-3 flex justify-between gap-4"><span className="text-muted-foreground">Starting price</span><strong>{quotedPrice} / person</strong></div>}
          </div>

          <div className="mx-auto mt-8 max-w-2xl border-t border-border pt-8">
            <h2 className="font-display text-2xl font-bold">What happens next?</h2>
            <div className="mt-5 grid gap-3 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-border p-4">
                <Check className="h-5 w-5 text-[var(--turquoise)]" />
                <p className="mt-3 text-sm font-bold">Request review</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Our team checks your date and group details.</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <Clock3 className="h-5 w-5 text-[var(--turquoise)]" />
                <p className="mt-3 text-sm font-bold">Quick response</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">We contact you to confirm availability and pickup.</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <ShieldCheck className="h-5 w-5 text-[var(--turquoise)]" />
                <p className="mt-3 text-sm font-bold">Final confirmation</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">You receive the final plan before your experience.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={getWhatsAppLink(message, site)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white"
            >
              <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
            </a>
            <Link
              href={`/tours/${booking.tourSlug}`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--ocean)] px-6 py-3 font-bold text-[var(--ocean)]"
            >
              Back to tour
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { FormEvent } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, CalendarDays, Mail, MessageCircle, Users } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminStatusBadge } from "@/Components/AdminStatusBadge";

type Props = {
  booking: {
    reference: string;
    fullName: string;
    email: string | null;
    whatsapp: string;
    travelDate: string;
    adults: number;
    children: number;
    hotel: string | null;
    specialRequests: string | null;
    adminNotes: string | null;
    status: string;
    quotedPrice: number | null;
    quotedCurrency: string | null;
    source: string;
    createdAt: string;
    contactedAt: string | null;
    confirmedAt: string | null;
    cancelledAt: string | null;
    tour: {
      title: string;
      slug: string;
      image: string | null;
    };
  };
  statuses: string[];
};

export default function AdminBookingShow({ booking, statuses }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    status: booking.status,
    admin_notes: booking.adminNotes ?? "",
  });
  const whatsappNumber = booking.whatsapp.replace(/[^\d]/g, "");
  const whatsappMessage = encodeURIComponent(`Hello ${booking.fullName}, this is Malta Tours and Safari regarding booking ${booking.reference} for ${booking.tour.title}.`);
  const quotedPrice = booking.quotedPrice && booking.quotedCurrency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: booking.quotedCurrency, maximumFractionDigits: 0 }).format(booking.quotedPrice)
    : "Price on request";

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    patch(`/admin/bookings/${booking.reference}`, { preserveScroll: true });
  }

  return (
    <AdminLayout title={booking.reference}>
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ocean)]"><ArrowLeft className="h-4 w-4" /> All bookings</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--turquoise)]">{booking.reference}</p><AdminStatusBadge status={booking.status} /></div>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{booking.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500">Received {booking.createdAt} via {booking.source}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp guest
          </a>
          {booking.email && (
            <a href={`mailto:${booking.email}?subject=${encodeURIComponent(`Booking ${booking.reference}`)}`} className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm font-bold">
              <Mail className="h-4 w-4" /> Email
            </a>
          )}
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="grid gap-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)]">
              {booking.tour.image
                ? <img src={booking.tour.image} alt={booking.tour.title} className="h-40 w-full object-cover sm:h-full" />
                : <div className="hidden bg-slate-100 sm:block" />}
              <div className="p-5 md:p-7">
            <h2 className="font-display text-xl font-bold">Trip details</h2>
            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <Detail label="Tour"><Link href={`/tours/${booking.tour.slug}`} className="font-semibold text-[var(--ocean)]">{booking.tour.title}</Link></Detail>
              <Detail label="Travel date"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{booking.travelDate}</span></Detail>
              <Detail label="Guests"><span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" />{booking.adults} adults, {booking.children} children</span></Detail>
              <Detail label="Starting price">{quotedPrice}</Detail>
              <Detail label="Hotel / pickup">{booking.hotel || "Not provided"}</Detail>
              <Detail label="WhatsApp">{booking.whatsapp}</Detail>
              <Detail label="Email">{booking.email || "Not provided"}</Detail>
            </dl>
            {booking.specialRequests && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Special requests</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{booking.specialRequests}</p>
              </div>
            )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="font-display text-xl font-bold">Booking timeline</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <Timeline label="Request received" value={booking.createdAt} />
              <Timeline label="Guest contacted" value={booking.contactedAt} />
              <Timeline label="Booking confirmed" value={booking.confirmedAt} />
              <Timeline label="Booking cancelled" value={booking.cancelledAt} />
            </div>
          </section>
        </div>

        <aside>
          <form onSubmit={save} className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold">Manage booking</h2>
            <label className="mt-5 grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
              <select value={data.status} onChange={(event) => setData("status", event.target.value)} className="rounded-xl border px-4 py-3 text-sm font-semibold capitalize">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              {errors.status && <span className="text-xs text-red-600">{errors.status}</span>}
            </label>
            <label className="mt-5 grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal notes</span>
              <textarea
                rows={7}
                value={data.admin_notes}
                onChange={(event) => setData("admin_notes", event.target.value)}
                placeholder="Private notes for the team"
                className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--turquoise)]"
              />
              {errors.admin_notes && <span className="text-xs text-red-600">{errors.admin_notes}</span>}
            </label>
            <button disabled={processing} className="mt-5 w-full rounded-full bg-[var(--ocean)] px-5 py-3 font-bold text-white disabled:opacity-60">
              {processing ? "Saving…" : "Save booking"}
            </button>
          </form>
        </aside>
      </div>
    </AdminLayout>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 text-slate-800">{children}</dd></div>;
}

function Timeline({ label, value }: { label: string; value: string | null }) {
  return <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span className="text-slate-600">{label}</span><strong className={value ? "text-slate-900" : "text-slate-300"}>{value || "—"}</strong></div>;
}

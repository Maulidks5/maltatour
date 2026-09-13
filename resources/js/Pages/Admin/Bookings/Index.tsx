import { Link, router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminStatusBadge } from "@/Components/AdminStatusBadge";
import { AdminEmptyState, AdminFilterTabs, AdminPageHeader, AdminPagination, AdminTableShell, adminTableCellClass, adminTableClass, adminTableHeadClass, adminTableHeaderCellClass, adminTableRowClass } from "@/Components/AdminUi";
import { ChevronRight, Inbox } from "lucide-react";

type BookingRow = {
  reference: string; fullName: string; whatsapp: string; email: string | null; tour: string;
  travelDate: string; guests: number; hotel: string | null; requests: string | null;
  status: string; createdAt: string;
};

type Props = {
  bookings: { data: BookingRow[]; links: Array<{ url: string | null; label: string; active: boolean }> };
  activeStatus: string | null;
  statuses: string[];
};

export default function AdminBookings({ bookings, activeStatus, statuses }: Props) {
  function updateStatus(reference: string, status: string) {
    router.patch(`/admin/bookings/${reference}`, { status }, { preserveScroll: true });
  }

  const filters = [
    { label: "All", href: "/admin/bookings", active: !activeStatus },
    ...statuses.map((status) => ({ label: status.charAt(0).toUpperCase() + status.slice(1), href: `/admin/bookings?status=${status}`, active: activeStatus === status })),
  ];

  return (
    <AdminLayout title="Bookings">
      <AdminPageHeader eyebrow="Customer activity" title="Bookings" description="Review customer requests, update progress and open full booking details." actions={<span className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm"><strong className="text-slate-900">{bookings.data.length}</strong> records on this page</span>} />
      <AdminFilterTabs items={filters} />

      <AdminTableShell>
        {bookings.data.length ? (
          <table className={adminTableClass}>
            <thead className={adminTableHeadClass}>
              <tr><th className={adminTableHeaderCellClass}>Booking</th><th className={adminTableHeaderCellClass}>Tour & travel</th><th className={adminTableHeaderCellClass}>Contact</th><th className={adminTableHeaderCellClass}>Status</th><th className={adminTableHeaderCellClass}><span className="sr-only">Action</span></th></tr>
            </thead>
            <tbody>
              {bookings.data.map((booking) => (
                <tr key={booking.reference} className={adminTableRowClass}>
                  <td className={adminTableCellClass}>
                    <Link href={`/admin/bookings/${booking.reference}`} className="font-bold text-[var(--ocean)] hover:underline">{booking.reference}</Link>
                    <p className="mt-1 font-semibold text-slate-900">{booking.fullName}</p>
                    <p className="mt-1 text-xs text-slate-400">Received {booking.createdAt}</p>
                  </td>
                  <td className={adminTableCellClass}>
                    <p className="font-semibold text-slate-800">{booking.tour}</p>
                    <p className="mt-1 text-xs text-slate-500">{booking.travelDate} · {booking.guests} guest{booking.guests === 1 ? "" : "s"}</p>
                    {booking.hotel && <p className="mt-1 max-w-52 truncate text-xs text-slate-400">{booking.hotel}</p>}
                  </td>
                  <td className={adminTableCellClass}>
                    <p className="font-medium text-slate-700">{booking.whatsapp}</p>
                    <p className="mt-1 text-xs text-slate-500">{booking.email || "No email provided"}</p>
                  </td>
                  <td className={adminTableCellClass}>
                    <div className="grid justify-items-start gap-2">
                      <AdminStatusBadge status={booking.status} />
                      <select aria-label={`Update ${booking.reference} status`} value={booking.status} onChange={(event) => updateStatus(booking.reference, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize outline-none focus:border-[var(--turquoise)]">
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className={`${adminTableCellClass} text-right`}>
                    <Link href={`/admin/bookings/${booking.reference}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[var(--ocean)] transition hover:border-[var(--ocean)]">View <ChevronRight className="h-3.5 w-3.5" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <AdminEmptyState icon={Inbox} title="No bookings found" description="Try another status filter." />}
      </AdminTableShell>
      <AdminPagination links={bookings.links} />
    </AdminLayout>
  );
}

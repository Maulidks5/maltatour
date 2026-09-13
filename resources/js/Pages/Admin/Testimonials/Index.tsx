import { router } from "@inertiajs/react";
import { MessageSquareQuote, Star } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminEmptyState, AdminFilterTabs, AdminPageHeader, AdminPagination, AdminTableShell, adminTableCellClass, adminTableClass, adminTableHeadClass, adminTableHeaderCellClass, adminTableRowClass } from "@/Components/AdminUi";

type Review = { reference: string; name: string; email: string; country: string | null; tourName: string | null; rating: number; content: string; status: string; isFeatured: boolean; createdAt: string };
type Props = { testimonials: { data: Review[]; links: Array<{ url: string | null; label: string; active: boolean }> }; activeStatus: string };

export default function AdminTestimonials({ testimonials, activeStatus }: Props) {
  const update = (review: Review, changes: Partial<{ status: string; is_featured: boolean }>) => router.patch(`/admin/testimonials/${review.reference}`, {
    status: changes.status ?? review.status,
    is_featured: changes.is_featured ?? review.isFeatured,
  }, { preserveScroll: true });

  const filters = [["", "All"], ["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]].map(([value, label]) => ({
    label, href: value ? `/admin/testimonials?status=${value}` : "/admin/testimonials", active: activeStatus === value,
  }));

  return (
    <AdminLayout title="Testimonials">
      <AdminPageHeader eyebrow="Customer activity" title="Traveller feedback" description="Moderate reviews and choose which approved testimonials appear publicly." />
      <AdminFilterTabs items={filters} />
      <AdminTableShell>
        {testimonials.data.length ? (
          <table className={adminTableClass}>
            <thead className={adminTableHeadClass}>
              <tr><th className={adminTableHeaderCellClass}>Traveller</th><th className={adminTableHeaderCellClass}>Feedback</th><th className={adminTableHeaderCellClass}>Rating</th><th className={adminTableHeaderCellClass}>Moderation</th></tr>
            </thead>
            <tbody>
              {testimonials.data.map((review) => (
                <tr key={review.reference} className={adminTableRowClass}>
                  <td className={adminTableCellClass}>
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{review.country || "Country not provided"}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--turquoise)]">{review.reference}</p>
                  </td>
                  <td className={`${adminTableCellClass} max-w-lg`}>
                    {review.tourName && <p className="text-xs font-bold text-slate-700">{review.tourName}</p>}
                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{review.content}</p>
                    <p className="mt-1 text-[10px] text-slate-400">Submitted {review.createdAt}</p>
                  </td>
                  <td className={adminTableCellClass}><div className="flex gap-0.5 text-amber-400">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < review.rating ? "fill-current" : "text-slate-200"}`} />)}</div></td>
                  <td className={adminTableCellClass}>
                    <div className="grid justify-items-start gap-2">
                      <select value={review.status} onChange={(event) => update(review, { status: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold capitalize outline-none focus:border-[var(--turquoise)]">{["pending", "approved", "rejected"].map((status) => <option key={status}>{status}</option>)}</select>
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={review.isFeatured} onChange={(event) => update(review, { is_featured: event.target.checked })} /> Featured</label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <AdminEmptyState icon={MessageSquareQuote} title="No feedback found" description="Try another moderation filter." />}
      </AdminTableShell>
      <AdminPagination links={testimonials.links} />
    </AdminLayout>
  );
}

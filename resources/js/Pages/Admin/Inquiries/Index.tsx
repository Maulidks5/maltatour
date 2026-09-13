import { router } from "@inertiajs/react";
import { Mail, MessageSquareText } from "lucide-react";
import { AdminLayout } from "@/Components/AdminLayout";
import { AdminEmptyState, AdminPageHeader, AdminPagination, AdminTableShell, adminTableCellClass, adminTableClass, adminTableHeadClass, adminTableHeaderCellClass, adminTableRowClass } from "@/Components/AdminUi";

type Inquiry = { reference: string; name: string; email: string; subject: string; message: string; status: string; createdAt: string };
type Props = { inquiries: { data: Inquiry[]; links: Array<{ url: string | null; label: string; active: boolean }> } };

export default function Inquiries({ inquiries }: Props) {
  return (
    <AdminLayout title="Messages">
      <AdminPageHeader eyebrow="Customer activity" title="Customer messages" description="Read contact-form enquiries, track their progress and reply by email." />
      <AdminTableShell>
        {inquiries.data.length ? (
          <table className={adminTableClass}>
            <thead className={adminTableHeadClass}>
              <tr><th className={adminTableHeaderCellClass}>Message</th><th className={adminTableHeaderCellClass}>Sender</th><th className={adminTableHeaderCellClass}>Received</th><th className={adminTableHeaderCellClass}>Status</th><th className={adminTableHeaderCellClass}><span className="sr-only">Action</span></th></tr>
            </thead>
            <tbody>
              {inquiries.data.map((item) => (
                <tr key={item.reference} className={adminTableRowClass}>
                  <td className={`${adminTableCellClass} max-w-md`}>
                    <p className="font-bold text-slate-900">{item.subject}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.message}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--turquoise)]">{item.reference}</p>
                  </td>
                  <td className={adminTableCellClass}><p className="font-semibold text-slate-800">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.email}</p></td>
                  <td className={`${adminTableCellClass} whitespace-nowrap text-slate-600`}>{item.createdAt}</td>
                  <td className={adminTableCellClass}>
                    <select value={item.status} onChange={(event) => router.patch(`/admin/inquiries/${item.reference}`, { status: event.target.value }, { preserveScroll: true })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold capitalize outline-none focus:border-[var(--turquoise)]">
                      {["new", "read", "replied", "archived"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className={`${adminTableCellClass} text-right`}><a href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[var(--ocean)] transition hover:border-[var(--ocean)]"><Mail className="h-3.5 w-3.5" /> Reply</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <AdminEmptyState icon={MessageSquareText} title="No messages yet" description="New contact messages will appear here." />}
      </AdminTableShell>
      <AdminPagination links={inquiries.links} />
    </AdminLayout>
  );
}

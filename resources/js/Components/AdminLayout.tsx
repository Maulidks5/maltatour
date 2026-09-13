import { ReactNode, useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { BookOpen, CalendarCheck, ChevronRight, ExternalLink, FileText, FolderKanban, GalleryHorizontalEnd, HelpCircle, Home, Images, LayoutDashboard, LogOut, MailQuestion, Menu, MessageSquareQuote, Settings2, UserRound, UsersRound, X } from "lucide-react";

type SharedProps = {
  auth: { user: { name: string; email: string; isAdmin: boolean; role: string; canManageUsers: boolean } | null };
  flash: { success: string | null };
};

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const page = usePage<SharedProps>();
  const { auth, flash } = page.props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = page.url.split("?")[0];
  const navigation = [
    {
      label: "Overview",
      links: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      label: "Website content",
      links: [
        { label: "Homepage text", href: "/admin/cms/settings?section=homepage", icon: Home },
        { label: "Hero slider", href: "/admin/cms/hero-slides", icon: GalleryHorizontalEnd },
        { label: "Homepage sections", href: "/admin/cms/home", icon: FileText },
        { label: "Tours & safaris", href: "/admin/tours", icon: BookOpen },
        { label: "Tour categories", href: "/admin/cms/categories", icon: FolderKanban },
        { label: "Page content", href: "/admin/cms/settings?section=pages", icon: FileText },
        { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
        { label: "Website media", href: "/admin/cms/media", icon: Images },
      ],
    },
    {
      label: "Customer activity",
      links: [
        { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
        { label: "Messages", href: "/admin/inquiries", icon: MailQuestion },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      ],
    },
    {
      label: "System",
      links: [
        { label: "Site settings", href: "/admin/cms/settings?section=general", icon: Settings2 },
        ...(auth.user?.canManageUsers ? [{ label: "Admin users", href: "/admin/users", icon: UsersRound }] : []),
      ],
    },
  ];

  function isActive(href: string) {
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefQuery) return currentPath === hrefPath && page.url.split("?")[1] === hrefQuery;
    return currentPath === hrefPath || (hrefPath !== "/admin" && currentPath.startsWith(`${hrefPath}/`));
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const inactivityTimeout = 30 * 60 * 1000;
    let logoutTimer = window.setTimeout(logout, inactivityTimeout);

    function logout() {
      router.post("/admin/logout", {}, { replace: true });
    }

    function resetTimer() {
      window.clearTimeout(logoutTimer);
      logoutTimer = window.setTimeout(logout, inactivityTimeout);
    }

    const activityEvents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));

    return () => {
      window.clearTimeout(logoutTimer);
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  const sidebar = (
    <>
      <div className="flex h-[4.5rem] items-center justify-between border-b border-white/10 px-5">
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          <img src="/brand/malta-logo.webp" alt="Malta Tours and Safari" className="h-11 w-11 shrink-0 rounded-full bg-white object-cover ring-2 ring-white/15" />
          <span className="min-w-0">
            <strong className="block truncate text-sm text-white">Malta Tours</strong>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Admin workspace</span>
          </span>
        </Link>
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close admin menu" className="grid h-10 w-10 place-items-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5">
        <nav className="grid gap-6">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{group.label}</p>
              <div className="mt-2 grid gap-1">
                {group.links.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group inline-flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-white text-[var(--ocean)] shadow-lg shadow-black/10"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
                      <span>{label}</span>
                      <ChevronRight className={`ml-auto h-4 w-4 ${active ? "opacity-50" : "opacity-0 transition group-hover:opacity-50"}`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
            <ExternalLink className="h-5 w-5" /> View website
          </a>
        </div>

        <div className="mt-auto pt-6">
          {auth.user && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--gold)] text-[var(--ocean)]"><UserRound className="h-4 w-4" /></span>
                <p className="min-w-0 text-xs leading-5 text-white/50">
                  <strong className="block truncate text-white">{auth.user.name}</strong>
                  <span className="block truncate">{auth.user.email}</span>
                </p>
              </div>
              <button type="button" onClick={() => router.post("/admin/logout", {}, { replace: true })} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-bold text-white/70 transition hover:border-rose-300/30 hover:bg-rose-500/10 hover:text-rose-200">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <Head title={`${title} · Admin`} />
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[17rem] flex-col bg-[var(--ocean)] lg:flex">
        {sidebar}
      </aside>

      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileOpen}>
        <button type="button" aria-label="Close admin menu" onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute inset-y-0 left-0 flex w-[min(86vw,19rem)] flex-col bg-[var(--ocean)] shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {sidebar}
        </aside>
      </div>

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open admin menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{title}</p>
                <p className="hidden text-xs text-slate-400 sm:block">Malta Tours administration</p>
              </div>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-[var(--ocean)]">
              <span className="hidden sm:inline">Open website</span><ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>

        <main className="mx-auto min-w-0 max-w-[100rem] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
          {flash.success && (
            <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
              {flash.success}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

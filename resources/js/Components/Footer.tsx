import { Link } from "./AppLink";
import { LockKeyhole, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSiteConfig } from "@/config/site";

export function Footer() {
  const site = useSiteConfig();
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Tours", to: "/tours" },
    { label: "Safaris", to: "/safaris" },
    { label: "About", to: "/about" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact", to: "/contact" },
    { label: "Leave feedback", to: "/feedback" },
  ];
  const popularTours = [
    { label: "Safari Blue Zanzibar", to: "/tours/safari-blue" },
    { label: "Prison Island", to: "/tours/prison-island" },
    { label: "Nakupenda Beach", to: "/tours/nakupenda-beach" },
    { label: "Mnemba Island", to: "/tours/mnemba-island" },
    { label: "Spice Tour", to: "/tours/spice-tour" },
  ];

  return (
    <footer className="bg-[oklch(0.20_0.04_240)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img
            src={site.logoPath}
            alt={site.name}
            className="h-32 w-auto rounded-full bg-white object-contain"
          />
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            {site.footerDescription}
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { label: "Facebook", mark: "f", href: site.social.facebook },
              { label: "Instagram", mark: "◎", href: site.social.instagram },
              { label: "X", mark: "𝕏", href: site.social.twitter },
              { label: "YouTube", mark: "▶", href: site.social.youtube },
            ].filter((social) => social.href).map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold hover:bg-[var(--gold)] hover:text-foreground transition">
                {social.mark}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-[var(--gold)]">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {quickLinks.map((link) => (
              <li key={link.label}><Link to={link.to} className="hover:text-[var(--gold)] transition">{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-[var(--gold)]">Popular Tours</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {popularTours.map((tour) => (
              <li key={tour.label}><Link to={tour.to} className="hover:text-[var(--gold)] transition">{tour.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-[var(--gold)]">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> {site.phone}</li>
            <li className="flex items-start gap-2"><MessageCircle className="h-4 w-4 mt-0.5 shrink-0" /> WhatsApp Support 24/7</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> {site.email}</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {site.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/60 sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 transition hover:text-[var(--gold)]"
              aria-label="Admin login"
            >
              <LockKeyhole className="h-3.5 w-3.5" />
              Admin Login
            </Link>
            <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />
            <p className="sm:text-right">
              Developed by{" "}
              <a
                href="https://www.myt.co.tz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/80 transition hover:text-[var(--gold)]"
              >
                Mwambao Youth Technology
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

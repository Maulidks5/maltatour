import { usePage } from "@inertiajs/react";

export type SiteConfig = {
  name: string;
  tagline: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  logoPath: string;
  ctaImagePath: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  phone: string;
  location: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
};

export const SITE_CONFIG: SiteConfig = {
  name: "Malta Tours and Safari",
  tagline: "Discover the Beauty of Zanzibar",
  footerDescription: "Your trusted local partner for authentic Zanzibar tours and Tanzania safaris.",
  seoTitle: "Malta Tours and Safari",
  seoDescription: "Authentic Zanzibar tours and Tanzania safaris.",
  logoPath: "/brand/malta-logo.webp",
  ctaImagePath: "/images/malta-tour-placeholder.jpg",
  whatsappNumber: "255772680767",
  whatsappMessage: "Hello Malta Tours and Safari, I would like to book a tour.",
  email: "info@maltatourtravel.com",
  phone: "+255 772 680 767",
  location: "Zanzibar, Tanzania",
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  },
};

export function useSiteConfig(): SiteConfig {
  return (usePage().props.site as SiteConfig | undefined) ?? SITE_CONFIG;
}

export const getWhatsAppLink = (customMessage?: string, config: SiteConfig = SITE_CONFIG) => {
  const msg = encodeURIComponent(customMessage || config.whatsappMessage);
  return `https://wa.me/${config.whatsappNumber}?text=${msg}`;
};

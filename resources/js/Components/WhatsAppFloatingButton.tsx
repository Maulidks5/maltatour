import { MessageCircle } from "lucide-react";
import { getWhatsAppLink, useSiteConfig } from "@/config/site";

export function WhatsAppFloatingButton() {
  const site = useSiteConfig();
  return (
    <a
      href={getWhatsAppLink(undefined, site)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-soft)] transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

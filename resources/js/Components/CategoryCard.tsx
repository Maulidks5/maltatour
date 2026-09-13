import { DEFAULT_TOUR_IMAGE } from "@/config/image";
import { ArrowUpRight } from "lucide-react";

interface Props {
  name: string;
  slug: string;
  description: string | null;
  image: string;
  toursCount: number;
}

export function CategoryCard({ name, slug, description, image, toursCount }: Props) {
  const href = slug === "tanzania-safaris" ? "/safaris" : `/tours?category=${slug}`;

  return (
    <a
      href={href}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] shadow-[var(--shadow-card)]"
    >
      <img
        src={image || DEFAULT_TOUR_IMAGE}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
        <h3 className="font-display text-xl md:text-2xl font-bold">{name}</h3>
        <p className="mt-1 text-sm text-white/85 line-clamp-2">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold)]">
          Explore {toursCount} {toursCount === 1 ? "tour" : "tours"} <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  );
}

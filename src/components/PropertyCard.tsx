import { Link } from "@tanstack/react-router";
import { Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { formatPrice, CATEGORY_LABELS } from "@/lib/format";

export type PropertyCardData = {
  id: string;
  title: string;
  category: string;
  property_type?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  area_m2?: number | null;
  neighborhood?: string | null;
  city?: string | null;
  cover_url?: string | null;
};

export function PropertyCard({ p }: { p: PropertyCardData }) {
  return (
    <Link
      to="/imovel/$id"
      params={{ id: p.id }}
      className="group block overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-luxury)] transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {p.cover_url ? (
          <img src={p.cover_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--wine)] to-[var(--wine-deep)]" />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--gold-foreground)]">
          {CATEGORY_LABELS[p.category]}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.property_type || "Imóvel"}</p>
        <h3 className="mt-1 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-[var(--wine)]">{p.title}</h3>
        {(p.neighborhood || p.city) && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} /> {[p.neighborhood, p.city].filter(Boolean).join(", ")}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {p.bedrooms != null && <span className="flex items-center gap-1"><Bed size={14} />{p.bedrooms}</span>}
          {p.bathrooms != null && <span className="flex items-center gap-1"><Bath size={14} />{p.bathrooms}</span>}
          {p.parking != null && <span className="flex items-center gap-1"><Car size={14} />{p.parking}</span>}
          {p.area_m2 != null && <span className="flex items-center gap-1"><Maximize size={14} />{p.area_m2}m²</span>}
        </div>
        <p className="mt-4 text-xl font-bold text-[var(--wine)]">{formatPrice(p.price ?? null, p.category)}</p>
      </div>
    </Link>
  );
}

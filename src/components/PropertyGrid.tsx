import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";

export function PropertyGrid({ category, featured, limit }: { category?: string; featured?: boolean; limit?: number }) {
  const [items, setItems] = useState<PropertyCardData[] | null>(null);

  useEffect(() => {
    let q = supabase.from("properties").select("id,title,category,property_type,price,bedrooms,bathrooms,parking,area_m2,neighborhood,city,cover_url").eq("published", true).order("created_at", { ascending: false });
    if (category) q = q.eq("category", category as any);
    if (featured) q = q.eq("featured", true);
    if (limit) q = q.limit(limit);
    q.then(({ data }) => setItems((data as any) || []));
  }, [category, featured, limit]);

  if (items === null) return <div className="py-20 text-center text-muted-foreground">Carregando imóveis…</div>;
  if (items.length === 0) return (
    <div className="py-20 text-center">
      <p className="text-lg text-muted-foreground">Nenhum imóvel disponível nesta categoria no momento.</p>
      <p className="text-sm text-muted-foreground/70 mt-2">Entre em contato conosco — temos novidades constantemente.</p>
    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(p => <PropertyCard key={p.id} p={p} />)}
    </div>
  );
}

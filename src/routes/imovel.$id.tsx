import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bed, Bath, Car, Maximize, MapPin, Phone, ArrowLeft } from "lucide-react";
import { formatPrice, CATEGORY_LABELS } from "@/lib/format";

export const Route = createFileRoute("/imovel/$id")({
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
      const { data: m } = await supabase.from("property_media").select("*").eq("property_id", id).order("sort_order");
      setData(p);
      setMedia(m || []);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="py-32 text-center text-muted-foreground">Carregando…</div>;
  if (!data) throw notFound();

  const images = media.filter(m => m.media_type === "image");
  const videos = media.filter(m => m.media_type === "video");
  const cover = images[active]?.url || data.cover_url;

  const whatsappMsg = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${data.title}`);

  return (
    <article className="container mx-auto px-4 py-10">
      <Link to="/venda" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--wine)] mb-6">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-[var(--shadow-luxury)]">
            {cover ? <img src={cover} alt={data.title} className="h-full w-full object-cover" /> : <div className="h-full bg-gradient-to-br from-[var(--wine)] to-[var(--wine-deep)]" />}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.map((m, i) => (
                <button key={m.id} onClick={() => setActive(i)} className={`aspect-square rounded-lg overflow-hidden border-2 ${i === active ? "border-[var(--gold)]" : "border-transparent"}`}>
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Vídeos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {videos.map(v => (
                  <video key={v.id} src={v.url} controls className="w-full rounded-xl bg-black aspect-video" />
                ))}
              </div>
            </div>
          )}
          {data.video_url && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Tour em vídeo</h2>
              <video src={data.video_url} controls className="w-full rounded-xl bg-black aspect-video" />
            </div>
          )}
          {data.description && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-3">Sobre o imóvel</h2>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{data.description}</p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <span className="inline-block rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--gold-foreground)]">
              {CATEGORY_LABELS[data.category]}
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight">{data.title}</h1>
            {(data.neighborhood || data.address) && (
              <p className="mt-2 flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {[data.address, data.neighborhood, data.city].filter(Boolean).join(", ")}
              </p>
            )}
            <p className="mt-5 text-3xl font-bold text-[var(--wine)]">{formatPrice(data.price, data.category)}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {data.bedrooms != null && <div className="flex items-center gap-2"><Bed size={16} className="text-[var(--wine)]" />{data.bedrooms} quartos</div>}
              {data.bathrooms != null && <div className="flex items-center gap-2"><Bath size={16} className="text-[var(--wine)]" />{data.bathrooms} banheiros</div>}
              {data.parking != null && <div className="flex items-center gap-2"><Car size={16} className="text-[var(--wine)]" />{data.parking} vagas</div>}
              {data.area_m2 != null && <div className="flex items-center gap-2"><Maximize size={16} className="text-[var(--wine)]" />{data.area_m2} m²</div>}
            </div>
            <a href={`https://wa.me/5586999448289?text=${whatsappMsg}`} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 w-full rounded-full bg-[var(--wine)] py-3.5 text-sm font-bold text-white hover:bg-[var(--wine-deep)] transition">
              <Phone size={16} /> WhatsApp (86) 99944-8289
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}

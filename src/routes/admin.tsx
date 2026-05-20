import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Upload, X, Star } from "lucide-react";
import { CATEGORY_LABELS, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Property = {
  id: string;
  title: string;
  description: string | null;
  category: "venda" | "locacao" | "administracao";
  property_type: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  area_m2: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  video_url: string | null;
  cover_url: string | null;
  featured: boolean;
  published: boolean;
};

const empty: Partial<Property> = {
  title: "", description: "", category: "venda", property_type: "", price: null,
  bedrooms: null, bathrooms: null, parking: null, area_m2: null,
  address: "", neighborhood: "", city: "Teresina", state: "PI",
  video_url: "", cover_url: "", featured: false, published: true,
};

function AdminPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Partial<Property> | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  const load = async () => {
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    setItems((data as any) || []);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  const remove = async (id: string) => {
    if (!confirm("Excluir este imóvel?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluído");
    load();
  };

  if (loading) return <div className="py-32 text-center">Carregando…</div>;
  if (!session) return null;
  if (!isAdmin) return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <h1 className="text-2xl font-bold">Acesso negado</h1>
      <p className="text-muted-foreground mt-2">Sua conta não tem permissões de administrador. Solicite acesso ao responsável da imobiliária.</p>
      <button onClick={logout} className="mt-6 rounded-lg bg-[var(--wine)] px-5 py-2.5 text-white text-sm">Sair</button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel do Catálogo</h1>
          <p className="text-muted-foreground text-sm">Gerencie todos os imóveis da imobiliária</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setEditing(empty)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--wine)] px-5 py-2.5 text-white text-sm font-semibold hover:bg-[var(--wine-deep)]">
            <Plus size={16} /> Novo imóvel
          </button>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th className="p-4">Imóvel</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">Nenhum imóvel cadastrado ainda. Clique em "Novo imóvel".</td></tr>}
            {items.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {p.cover_url && <img src={p.cover_url} className="h-12 w-16 object-cover rounded" alt="" />}
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.neighborhood || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{CATEGORY_LABELS[p.category]}</td>
                <td className="p-4">{formatPrice(p.price, p.category)}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {p.featured && <span className="text-[var(--gold)]" title="Destaque"><Star size={14} fill="currentColor" /></span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-1">
                    <Link to="/imovel/$id" params={{ id: p.id }} className="rounded p-2 hover:bg-secondary" title="Ver">👁</Link>
                    <button onClick={() => setEditing(p)} className="rounded p-2 hover:bg-secondary" title="Editar"><Pencil size={16} /></button>
                    <button onClick={() => remove(p.id)} className="rounded p-2 hover:bg-destructive/10 text-destructive" title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <PropertyEditor initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function PropertyEditor({ initial, onClose, onSaved }: { initial: Partial<Property>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Property>>(initial);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const isNew = !initial.id;

  useEffect(() => {
    if (initial.id) {
      supabase.from("property_media").select("*").eq("property_id", initial.id).order("sort_order").then(({ data }) => setMedia(data || []));
    }
  }, [initial.id]);

  const set = (k: keyof Property, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.category) return toast.error("Título e categoria são obrigatórios");
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        description: form.description || null,
        category: form.category,
        property_type: form.property_type || null,
        price: form.price ?? null,
        bedrooms: form.bedrooms ?? null,
        bathrooms: form.bathrooms ?? null,
        parking: form.parking ?? null,
        area_m2: form.area_m2 ?? null,
        address: form.address || null,
        neighborhood: form.neighborhood || null,
        city: form.city || null,
        state: form.state || null,
        video_url: form.video_url || null,
        cover_url: form.cover_url || null,
        featured: !!form.featured,
        published: form.published !== false,
      };
      let id = form.id;
      if (isNew) {
        const { data: { user } } = await supabase.auth.getUser();
        payload.created_by = user?.id;
        const { data, error } = await supabase.from("properties").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from("properties").update(payload).eq("id", id!);
        if (error) throw error;
      }
      toast.success("Salvo!");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = async (files: FileList | null, type: "image" | "video") => {
    if (!files || !form.id) {
      if (!form.id) toast.error("Salve o imóvel antes de enviar mídias.");
      return;
    }
    for (const f of Array.from(files)) {
      const ext = f.name.split(".").pop();
      const path = `${form.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("property-media").upload(path, f);
      if (error) { toast.error(error.message); continue; }
      const { data: pub } = supabase.storage.from("property-media").getPublicUrl(path);
      const { error: mErr } = await supabase.from("property_media").insert({
        property_id: form.id, url: pub.publicUrl, media_type: type, sort_order: media.length,
      });
      if (mErr) { toast.error(mErr.message); continue; }
      if (type === "image" && !form.cover_url) {
        await supabase.from("properties").update({ cover_url: pub.publicUrl }).eq("id", form.id);
        set("cover_url", pub.publicUrl);
      }
    }
    const { data } = await supabase.from("property_media").select("*").eq("property_id", form.id).order("sort_order");
    setMedia(data || []);
    toast.success("Mídia enviada");
  };

  const deleteMedia = async (m: any) => {
    await supabase.from("property_media").delete().eq("id", m.id);
    setMedia(media.filter(x => x.id !== m.id));
  };

  const setCover = async (url: string) => {
    await supabase.from("properties").update({ cover_url: url }).eq("id", form.id!);
    set("cover_url", url);
    toast.success("Capa atualizada");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-card rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <h2 className="text-xl font-bold">{isNew ? "Novo imóvel" : "Editar imóvel"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Título *"><input className="input" value={form.title || ""} onChange={e => set("title", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria *">
              <select className="input" value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="venda">Venda</option>
                <option value="locacao">Locação</option>
                <option value="administracao">Administração</option>
              </select>
            </Field>
            <Field label="Tipo (Casa, Apto, Terreno…)"><input className="input" value={form.property_type || ""} onChange={e => set("property_type", e.target.value)} /></Field>
          </div>
          <Field label="Descrição"><textarea rows={4} className="input" value={form.description || ""} onChange={e => set("description", e.target.value)} /></Field>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Field label="Preço (R$)"><input type="number" step="0.01" className="input" value={form.price ?? ""} onChange={e => set("price", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Quartos"><input type="number" className="input" value={form.bedrooms ?? ""} onChange={e => set("bedrooms", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Banheiros"><input type="number" className="input" value={form.bathrooms ?? ""} onChange={e => set("bathrooms", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Vagas"><input type="number" className="input" value={form.parking ?? ""} onChange={e => set("parking", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Área (m²)"><input type="number" step="0.01" className="input" value={form.area_m2 ?? ""} onChange={e => set("area_m2", e.target.value ? Number(e.target.value) : null)} /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Endereço"><input className="input" value={form.address || ""} onChange={e => set("address", e.target.value)} /></Field>
            <Field label="Bairro"><input className="input" value={form.neighborhood || ""} onChange={e => set("neighborhood", e.target.value)} /></Field>
            <Field label="Cidade"><input className="input" value={form.city || ""} onChange={e => set("city", e.target.value)} /></Field>
            <Field label="Estado (UF)"><input className="input" value={form.state || ""} onChange={e => set("state", e.target.value)} /></Field>
          </div>
          <Field label="URL de vídeo (YouTube/MP4 — opcional)"><input className="input" value={form.video_url || ""} onChange={e => set("video_url", e.target.value)} /></Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={e => set("featured", e.target.checked)} /> Destaque na home</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published !== false} onChange={e => set("published", e.target.checked)} /> Publicado</label>
          </div>

          {!isNew && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Fotos e vídeos</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                <label className="inline-flex items-center gap-2 rounded-lg bg-[var(--wine)] text-white px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-[var(--wine-deep)]">
                  <Upload size={14} /> Enviar fotos
                  <input type="file" multiple accept="image/*" className="hidden" onChange={e => uploadFiles(e.target.files, "image")} />
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-secondary">
                  <Upload size={14} /> Enviar vídeo
                  <input type="file" multiple accept="video/*" className="hidden" onChange={e => uploadFiles(e.target.files, "video")} />
                </label>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {media.map(m => (
                  <div key={m.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-square">
                    {m.media_type === "image"
                      ? <img src={m.url} className="h-full w-full object-cover" alt="" />
                      : <video src={m.url} className="h-full w-full object-cover" />}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      {m.media_type === "image" && (
                        <button onClick={() => setCover(m.url)} className="bg-[var(--gold)] text-[var(--gold-foreground)] rounded p-1.5" title="Definir como capa"><Star size={14} /></button>
                      )}
                      <button onClick={() => deleteMedia(m)} className="bg-destructive text-white rounded p-1.5"><Trash2 size={14} /></button>
                    </div>
                    {form.cover_url === m.url && <span className="absolute top-1 left-1 bg-[var(--gold)] text-[var(--gold-foreground)] text-[10px] px-1.5 py-0.5 rounded font-bold">CAPA</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {isNew && <p className="text-xs text-muted-foreground italic">Salve o imóvel para começar a adicionar fotos e vídeos.</p>}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-card rounded-b-2xl">
          <button onClick={onClose} className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-secondary">Cancelar</button>
          <button disabled={saving} onClick={save} className="rounded-lg bg-[var(--wine)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--wine-deep)] disabled:opacity-60">
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
      <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--ring)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

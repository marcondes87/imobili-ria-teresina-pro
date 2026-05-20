import { createFileRoute } from "@tanstack/react-router";
import { PropertyGrid } from "@/components/PropertyGrid";

export const Route = createFileRoute("/venda")({
  head: () => ({ meta: [{ title: "Imóveis à Venda — Mel & Samara" }, { name: "description", content: "Casas, apartamentos e terrenos à venda em Teresina/PI." }] }),
  component: () => <CategoryPage title="Imóveis à Venda" subtitle="Encontre o lar dos seus sonhos" category="venda" />,
});

export function CategoryPage({ title, subtitle, category }: { title: string; subtitle: string; category: string }) {
  return (
    <>
      <section className="bg-gradient-to-br from-[var(--wine-deep)] to-[var(--wine)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--gold)] text-xs uppercase tracking-widest font-bold">{subtitle}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <PropertyGrid category={category} />
      </section>
    </>
  );
}

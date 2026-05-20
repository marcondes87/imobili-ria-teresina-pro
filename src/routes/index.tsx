import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Key, Briefcase, Shield, Award, HeartHandshake } from "lucide-react";
import { PropertyGrid } from "@/components/PropertyGrid";
import heroBg from "@/assets/hero-bg.png";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mel & Samara Corretores Associados — Imóveis em Teresina/PI" },
      { name: "description", content: "Venda, locação e administração de imóveis em Teresina/PI com atendimento profissional e personalizado." },
    ],
  }),
  component: Home,
});

const categories = [
  { to: "/venda", icon: Building2, title: "Venda", desc: "Casas, apartamentos e terrenos selecionados para você comprar." },
  { to: "/locacao", icon: Key, title: "Locação", desc: "Imóveis prontos para alugar com segurança jurídica." },
  { to: "/administracao", icon: Briefcase, title: "Administração", desc: "Cuidamos do seu imóvel — contratos, vistorias e cobrança." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--wine-deep)]/95 via-[var(--wine)]/80 to-[var(--wine-deep)]/95" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center text-white">
          <img src={logo} alt="" className="mx-auto h-24 md:h-32 w-auto mb-8 drop-shadow-2xl" />
          <p className="inline-block px-4 py-1.5 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-semibold uppercase tracking-widest mb-6">
            Corretores Associados · Teresina/PI
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto">
            Seu imóvel em <span className="text-[var(--gold)] italic">boas mãos</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Compra, venda, locação e administração com transparência, agilidade e o atendimento que você merece.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/venda" className="group inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[var(--gold-foreground)] hover:opacity-90 transition">
              Ver imóveis <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition">
              Falar conosco
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-[var(--wine)] text-xs font-bold uppercase tracking-widest">O que fazemos</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">Soluções completas em imóveis</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(c => (
            <Link key={c.to} to={c.to as any} className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 hover:border-[var(--gold)] hover:shadow-[var(--shadow-luxury)] transition-all">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--gold)]/10 group-hover:scale-150 transition-transform duration-700" />
              <c.icon className="relative h-12 w-12 text-[var(--wine)] mb-4" />
              <h3 className="relative text-2xl font-bold">{c.title}</h3>
              <p className="relative mt-2 text-muted-foreground">{c.desc}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--wine)] group-hover:gap-3 transition-all">
                Explorar <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-[var(--wine)] text-xs font-bold uppercase tracking-widest">Destaques</p>
              <h2 className="mt-2 text-3xl md:text-5xl font-bold">Imóveis em destaque</h2>
            </div>
            <Link to="/venda" className="text-sm font-semibold text-[var(--wine)] hover:text-[var(--gold)]">Ver todos →</Link>
          </div>
          <PropertyGrid featured limit={6} />
        </div>
      </section>

      {/* TRUST */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { i: Shield, t: "CRECI ativo", d: "Registros 3730/PF e 4331/PF — atendimento jurídico e regular." },
            { i: Award, t: "Anos de experiência", d: "Equipe especializada no mercado de Teresina e região." },
            { i: HeartHandshake, t: "Atendimento humano", d: "Acompanhamento personalizado em cada etapa." },
          ].map(b => (
            <div key={b.t} className="flex gap-4">
              <div className="shrink-0 h-14 w-14 rounded-xl bg-[var(--wine)] flex items-center justify-center">
                <b.i className="text-[var(--gold)]" size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{b.t}</h3>
                <p className="text-muted-foreground mt-1">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

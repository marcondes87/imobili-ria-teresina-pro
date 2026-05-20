import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Mel & Samara Corretores" }, { name: "description", content: "Entre em contato com a Mel & Samara Corretores Associados em Teresina/PI." }] }),
  component: Contato,
});

function Contato() {
  return (
    <>
      <section className="bg-gradient-to-br from-[var(--wine-deep)] to-[var(--wine)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--gold)] text-xs uppercase tracking-widest font-bold">Fale conosco</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">Estamos prontos para atender você</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid gap-10 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          {[
            { i: Phone, t: "Telefone / WhatsApp", v: "(86) 99944-8289", href: "https://wa.me/5586999448289" },
            { i: MapPin, t: "Endereço", v: "Rua Gen. Ademar Richa, 1453, Sala A — Bairro de Fátima, Teresina/PI" },
            { i: Mail, t: "E-mail", v: "contato@melesamara.com.br", href: "mailto:contato@melesamara.com.br" },
            { i: Clock, t: "Atendimento", v: "Seg. a Sex. das 8h às 18h · Sáb. das 8h às 12h" },
          ].map(c => (
            <div key={c.t} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="shrink-0 h-14 w-14 rounded-xl bg-[var(--wine)] flex items-center justify-center">
                <c.i className="text-[var(--gold)]" size={26} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{c.t}</p>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-semibold text-[var(--wine)] hover:underline">{c.v}</a>
                ) : (
                  <p className="mt-1 text-lg font-semibold">{c.v}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-luxury)] aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px]">
          <iframe
            title="Mapa Mel & Samara"
            className="w-full h-full"
            src="https://www.google.com/maps?q=Rua+Gen.+Ademar+Richa+1453+Bairro+de+Fatima+Teresina+PI&output=embed"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

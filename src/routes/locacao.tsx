import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./venda";

export const Route = createFileRoute("/locacao")({
  head: () => ({ meta: [{ title: "Imóveis para Alugar — Mel & Samara" }, { name: "description", content: "Imóveis para locação em Teresina/PI." }] }),
  component: () => <CategoryPage title="Imóveis para Alugar" subtitle="Pronto para morar" category="locacao" />,
});

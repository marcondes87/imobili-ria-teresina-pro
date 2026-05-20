import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./venda";

export const Route = createFileRoute("/administracao")({
  head: () => ({ meta: [{ title: "Administração de Imóveis — Mel & Samara" }, { name: "description", content: "Administração profissional de imóveis em Teresina/PI." }] }),
  component: () => <CategoryPage title="Administração de Imóveis" subtitle="Cuidamos do seu patrimônio" category="administracao" />,
});

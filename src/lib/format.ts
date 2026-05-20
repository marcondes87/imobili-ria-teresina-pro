export function formatPrice(value: number | null | undefined, category?: string) {
  if (value == null) return "Consulte";
  const v = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
  return category === "locacao" ? `${v}/mês` : v;
}

export const CATEGORY_LABELS: Record<string, string> = {
  venda: "Venda",
  locacao: "Locação",
  administracao: "Administração",
};

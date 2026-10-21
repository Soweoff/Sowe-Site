export type Category =
  | "IMOVEL"
  | "DINHEIRO"
  | "ACOES"
  | "BANCO"
  | "SKINS"
  | "CRIPTO"
  | "OUTROS";

export const CATEGORY_INFO: Record<Category, { label: string; color: string }> = {
  IMOVEL: { label: "Imóveis", color: "#60a5fa" },
  DINHEIRO: { label: "Dinheiro em mãos", color: "#4ade80" },
  ACOES: { label: "Ações", color: "#c084fc" },
  BANCO: { label: "Banco rendendo", color: "#f4c901" },
  SKINS: { label: "Skins de CS2", color: "#fb923c" },
  CRIPTO: { label: "Cripto", color: "#f472b6" },
  OUTROS: { label: "Outros", color: "#94a3b8" },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_INFO) as Category[];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const formatUsd = (n: number) => usd.format(n);
export const formatBrl = (n: number) => brl.format(n);

// Aceita "1.234,56", "1234.56", "R$ 10.000", "US$ 2000"; devolve null se inválido.
export function parseMoney(input: string): number | null {
  let s = input.replace(/[^\d.,]/g, "");
  if (!s) return null;
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// Largura da barra (0–100) mesmo que a meta já tenha sido ultrapassada.
export function barWidth(pct: number): number {
  return Math.min(100, Math.max(0, pct));
}

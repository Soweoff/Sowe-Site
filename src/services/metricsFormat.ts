// Funções puras usadas na tela de métricas (fáceis de testar).

export function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return null; // sem base de comparação
  return ((current - previous) / previous) * 100;
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPct(p: number): string {
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(Math.abs(p) < 10 ? 1 : 0).replace(".", ",")}%`;
}

export function minutesToHours(min: number): number {
  return Math.round(min / 60);
}

// Gera o desenho (linha e área) de um mini-gráfico em SVG.
export function sparkline(values: number[], width: number, height: number) {
  if (values.length < 2) return { line: "", area: "" };
  const max = Math.max(...values, 1);
  const pad = 2;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - pad - (v / max) * (height - pad * 2);
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return { line, area };
}

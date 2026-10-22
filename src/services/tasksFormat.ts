export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EPIC";

export const DIFFICULTY_INFO: Record<
  Difficulty,
  { label: string; xp: number; color: string }
> = {
  EASY: { label: "Fácil", xp: 10, color: "#4ade80" },
  MEDIUM: { label: "Média", xp: 20, color: "#d9a94f" },
  HARD: { label: "Difícil", xp: 40, color: "#fb923c" },
  EPIC: { label: "Épica", xp: 80, color: "#c084fc" },
};

export function difficultyInfo(d: string) {
  return DIFFICULTY_INFO[d as Difficulty] ?? DIFFICULTY_INFO.MEDIUM;
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

// "2026-10-21" -> "qua, 21/10". Usa meio-dia para não sofrer com fuso.
export function dayLabel(day: string): string {
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return day;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${WEEKDAYS[d.getDay()]}, ${dd}/${mm}`;
}

// Altura (0–100) de cada barra, relativa ao maior valor.
export function barHeights(values: number[]): number[] {
  const max = Math.max(0, ...values);
  if (max === 0) return values.map(() => 0);
  return values.map((v) => (v === 0 ? 0 : Math.max(6, Math.round((v / max) * 100))));
}

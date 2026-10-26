// Tipos e opções de período das métricas do YouTube, usados no painel do admin
// (/admin/metrics) e na página pública (/youtube).

export interface Totals {
  views: number;
  minutesWatched: number;
  subscribersGained: number;
  subscribersLost: number;
}

export interface PeriodData {
  current: Totals;
  previous: Totals;
  daily: { date: string; views: number }[];
}

export interface Channel {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  subscribers: number | null;
  views: number;
  videos: number;
  period: PeriodData | null;
}

export interface YoutubeResponse {
  updatedAt: string;
  days: number;
  stale?: boolean;
  channels: Channel[];
}

export const PERIODS = [
  { days: 30, label: "30 dias" },
  { days: 90, label: "90 dias" },
  { days: 365, label: "1 ano" },
];

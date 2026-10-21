import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import {
  DIFFICULTY_INFO,
  barHeights,
  dayLabel,
  difficultyInfo,
  type Difficulty,
} from "../services/tasksFormat";
import "../styles/style.css";

interface Stats {
  level: number;
  xp: number;
  into: number;
  needed: number;
  streak: { current: number; best: number };
  completedTotal: number;
  completedToday: number;
  pending: number;
}

interface Quest {
  id: number;
  title: string;
  difficulty: string;
  xp: number;
  day: string;
  overdue: boolean;
}

interface ActiveResponse {
  today: string;
  tasks: Quest[];
  stats: Stats;
}

interface ReportResponse {
  days: number;
  completed: number;
  xp: number;
  byDay: { date: string; count: number; xp: number }[];
  byDifficulty: Record<Difficulty, number>;
  items: { id: number; title: string; difficulty: string; xp: number; doneAt: string }[];
  stats: Stats;
}

const REPORT_PERIODS = [
  { days: 7, label: "7 dias" },
  { days: 30, label: "30 dias" },
  { days: 90, label: "90 dias" },
];

function LevelBar({ stats }: { stats: Stats }) {
  const pct = Math.min(100, Math.round((stats.into / stats.needed) * 100));
  return (
    <section className="tasks-hero">
      <div className="tasks-level" aria-label={`Nível ${stats.level}`}>
        <span>NÍVEL</span>
        <strong>{stats.level}</strong>
      </div>
      <div className="tasks-hero-main">
        <div className="tasks-xp-row">
          <span>{stats.xp} XP no total</span>
          <span>
            {stats.into} / {stats.needed} para o nível {stats.level + 1}
          </span>
        </div>
        <div className="tasks-xp-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="tasks-xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="tasks-streak" title={`Melhor sequência: ${stats.streak.best} dias`}>
        <strong>🔥 {stats.streak.current}</strong>
        <span>{stats.streak.current === 1 ? "dia seguido" : "dias seguidos"}</span>
      </div>
    </section>
  );
}

function Quests() {
  const [data, setData] = useState<ActiveResponse | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [adding, setAdding] = useState(false);
  const [leaving, setLeaving] = useState<Record<number, number>>({});
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const res = await api.get<ActiveResponse>("/tasks");
      setData(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível carregar as missões."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    const text = title.trim();
    if (!text || adding) return;
    try {
      setAdding(true);
      await api.post("/tasks", { title: text, difficulty });
      setTitle("");
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível adicionar a missão."));
    } finally {
      setAdding(false);
    }
  }

  async function complete(q: Quest) {
    if (leaving[q.id] !== undefined || !data) return;
    const before = data.stats.level;
    try {
      const res = await api.patch<Stats>(`/tasks/${q.id}/complete`);
      setLeaving((l) => ({ ...l, [q.id]: q.xp }));
      setToast(
        res.data.level > before
          ? `⭐ Subiu para o nível ${res.data.level}!`
          : `+${q.xp} XP`,
      );
      window.setTimeout(() => {
        setData((d) =>
          d ? { ...d, tasks: d.tasks.filter((t) => t.id !== q.id), stats: res.data } : d,
        );
        setLeaving((l) => {
          const rest = { ...l };
          delete rest[q.id];
          return rest;
        });
      }, 650);
      window.setTimeout(() => setToast(""), 2200);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível concluir a missão."));
    }
  }

  async function remove(q: Quest) {
    if (!window.confirm(`Apagar a missão "${q.title}"?`)) return;
    try {
      await api.delete(`/tasks/${q.id}`);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível apagar a missão."));
    }
  }

  const tasks = data?.tasks ?? [];
  const late = tasks.filter((t) => t.overdue);
  const today = tasks.filter((t) => !t.overdue && t.day === data?.today);
  const next = tasks.filter((t) => t.day > (data?.today ?? ""));

  function Group({ label, items }: { label: string; items: Quest[] }) {
    if (items.length === 0) return null;
    return (
      <div className="tasks-group">
        <h2 className="tasks-group-title">{label}</h2>
        <ul className="tasks-list">
          {items.map((q) => {
            const info = difficultyInfo(q.difficulty);
            const going = leaving[q.id] !== undefined;
            return (
              <li
                key={q.id}
                className={`tasks-item${going ? " done" : ""}`}
                style={{ borderLeftColor: info.color }}
              >
                <button
                  className="tasks-check"
                  onClick={() => complete(q)}
                  aria-label={`Concluir: ${q.title}`}
                  disabled={going}
                >
                  {going ? "✓" : ""}
                </button>
                <div className="tasks-item-body">
                  <span className="tasks-item-title">{q.title}</span>
                  <span className="tasks-item-meta">
                    <span className="tasks-badge" style={{ color: info.color, borderColor: info.color }}>
                      {info.label}
                    </span>
                    {q.overdue && <span className="tasks-late">de {dayLabel(q.day)}</span>}
                    {q.day > (data?.today ?? "") && <span>{dayLabel(q.day)}</span>}
                  </span>
                </div>
                <span className="tasks-xp-tag">+{q.xp} XP</span>
                <button className="tasks-remove" onClick={() => remove(q)} aria-label="Apagar missão">
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <>
      {data && <LevelBar stats={data.stats} />}

      <form className="tasks-form" onSubmit={add}>
        <input
          className="tasks-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nova missão do dia…"
          maxLength={120}
          aria-label="Nova missão"
        />
        <select
          className="tasks-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          aria-label="Dificuldade"
        >
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_INFO[d].label} · {DIFFICULTY_INFO[d].xp} XP
            </option>
          ))}
        </select>
        <button className="btn-primary" type="submit" disabled={adding || !title.trim()}>
          Adicionar
        </button>
      </form>

      {error && <p className="tasks-error" role="alert">{error}</p>}

      {data && tasks.length === 0 && (
        <div className="tasks-empty">
          <strong>Tudo limpo! 🎉</strong>
          <span>Nenhuma missão pendente. Adicione a próxima acima.</span>
        </div>
      )}

      {Group({ label: "Atrasadas", items: late })}
      {Group({ label: "Hoje", items: today })}
      {Group({ label: "Próximos dias", items: next })}

      {toast && <div className="tasks-toast" role="status">{toast}</div>}
    </>
  );
}

function Report() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<ReportResponse>("/tasks/report", { params: { days } });
      setData(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível carregar o relatório."));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  async function reopen(id: number) {
    try {
      await api.patch(`/tasks/${id}/reopen`);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível reabrir a missão."));
    }
  }

  const heights = barHeights(data?.byDay.map((d) => d.count) ?? []);
  const grouped = new Map<string, ReportResponse["items"]>();
  for (const it of data?.items ?? []) {
    const key = new Date(it.doneAt).toLocaleDateString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });
    grouped.set(key, [...(grouped.get(key) ?? []), it]);
  }

  return (
    <>
      <div className="metrics-periods" role="group" aria-label="Período do relatório">
        {REPORT_PERIODS.map((p) => (
          <button
            key={p.days}
            className={`metrics-period${p.days === days ? " active" : ""}`}
            onClick={() => setDays(p.days)}
            disabled={loading && p.days === days}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className="tasks-error" role="alert">{error}</p>}

      {data && (
        <div className={`metrics-content${loading ? " loading" : ""}`}>
          <div className="metrics-kpis">
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Missões concluídas</span>
              <strong>{data.completed}</strong>
              <span className="metrics-kpi-foot">nos últimos {data.days} dias</span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">XP ganho</span>
              <strong>{data.xp}</strong>
              <span className="metrics-kpi-foot">
                nível {data.stats.level} · {data.stats.xp} XP no total
              </span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Sequência</span>
              <strong>🔥 {data.stats.streak.current}</strong>
              <span className="metrics-kpi-foot">melhor: {data.stats.streak.best} dias</span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Pendentes</span>
              <strong>{data.stats.pending}</strong>
              <span className="metrics-kpi-foot">{data.stats.completedTotal} concluídas no total</span>
            </div>
          </div>

          <section className="metrics-card tasks-chart-card">
            <h2 className="tasks-group-title">Concluídas por dia</h2>
            <div className="tasks-bars" role="img" aria-label="Missões concluídas por dia">
              {data.byDay.map((d, i) => (
                <div
                  key={d.date}
                  className="tasks-bar-col"
                  title={`${dayLabel(d.date)}: ${d.count} missão(ões), ${d.xp} XP`}
                >
                  <div className="tasks-bar" style={{ height: `${heights[i]}%` }} />
                </div>
              ))}
            </div>
            <div className="tasks-bars-foot">
              <span>{dayLabel(data.byDay[0].date)}</span>
              <span>{dayLabel(data.byDay[data.byDay.length - 1].date)}</span>
            </div>
            <div className="tasks-diffs">
              {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => (
                <span key={d} className="tasks-badge" style={{ color: DIFFICULTY_INFO[d].color, borderColor: DIFFICULTY_INFO[d].color }}>
                  {DIFFICULTY_INFO[d].label}: {data.byDifficulty[d]}
                </span>
              ))}
            </div>
          </section>

          {data.items.length === 0 ? (
            <div className="tasks-empty">
              <strong>Nada concluído neste período ainda.</strong>
              <span>Conclua uma missão e ela aparece aqui.</span>
            </div>
          ) : (
            [...grouped.entries()].map(([day, items]) => (
              <div className="tasks-group" key={day}>
                <h2 className="tasks-group-title">
                  {dayLabel(day)} · {items.length} concluída{items.length > 1 ? "s" : ""}
                </h2>
                <ul className="tasks-list">
                  {items.map((it) => (
                    <li key={it.id} className="tasks-item finished" style={{ borderLeftColor: difficultyInfo(it.difficulty).color }}>
                      <span className="tasks-check checked">✓</span>
                      <div className="tasks-item-body">
                        <span className="tasks-item-title">{it.title}</span>
                        <span className="tasks-item-meta">
                          {new Date(it.doneAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "America/Sao_Paulo",
                          })}
                        </span>
                      </div>
                      <span className="tasks-xp-tag">+{it.xp} XP</span>
                      <button className="tasks-remove" onClick={() => reopen(it.id)} title="Voltar para as missões" aria-label="Reabrir missão">
                        ↺
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default function Tasks() {
  const [tab, setTab] = useState<"quests" | "report">("quests");

  return (
    <div className="dashboard-container metrics-page tasks-page">
      <div className="metrics-header">
        <div>
          <h1 className="metrics-title">Missões do dia</h1>
          <p className="metrics-sub">Conclua, ganhe XP e suba de nível</p>
        </div>
        <div className="metrics-actions">
          <div className="metrics-periods" role="tablist" aria-label="Seção">
            <button role="tab" aria-selected={tab === "quests"} className={`metrics-period${tab === "quests" ? " active" : ""}`} onClick={() => setTab("quests")}>
              Missões
            </button>
            <button role="tab" aria-selected={tab === "report"} className={`metrics-period${tab === "report" ? " active" : ""}`} onClick={() => setTab("report")}>
              Relatório
            </button>
          </div>
          <Link to="/admin" className="btn-secondary">
            Painel
          </Link>
        </div>
      </div>

      {tab === "quests" ? <Quests /> : <Report />}
    </div>
  );
}

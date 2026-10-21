import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import {
  CATEGORY_INFO,
  CATEGORY_ORDER,
  barWidth,
  formatBrl,
  formatUsd,
  parseMoney,
  type Category,
} from "../services/wealthFormat";
import "../styles/style.css";

interface Holding {
  id: number;
  category: Category;
  label: string;
  amount: number;
  currency: "BRL" | "USD";
  usd: number;
}

interface Summary {
  goalUsd: number;
  deadline: string;
  daysLeft: number;
  rate: number;
  rateInfo: { fetchedAt: string; stale: boolean };
  totalUsd: number;
  totalBrl: number;
  pct: number;
  remainingUsd: number;
  perMonthUsd: number;
  byCategory: { category: Category; usd: number; brl: number; share: number }[];
  holdings: Holding[];
}

const HIDE_KEY = "goal-hide-values";

function readHidden(): boolean {
  try {
    return localStorage.getItem(HIDE_KEY) === "1";
  } catch {
    return false;
  }
}

function formatDeadline(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function Goal() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(readHidden);

  const [category, setCategory] = useState<Category>("BANCO");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const res = await api.get<Summary>("/wealth");
      setData(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível carregar a meta."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggleHidden() {
    const next = !hidden;
    setHidden(next);
    try {
      localStorage.setItem(HIDE_KEY, next ? "1" : "0");
    } catch {
      /* sem armazenamento: segue só em memória */
    }
  }

  const money = (text: string) => (hidden ? "••••••" : text);

  async function add(e: FormEvent) {
    e.preventDefault();
    const value = parseMoney(amount);
    if (!label.trim() || value === null || saving) {
      setError("Informe um nome e um valor válido (ex.: 150.000,00).");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await api.post("/wealth/holdings", {
        category,
        label: label.trim(),
        amount: Math.round(value * 100) / 100,
        currency,
      });
      setLabel("");
      setAmount("");
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível salvar o valor."));
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(h: Holding) {
    const value = parseMoney(editValue);
    setEditId(null);
    if (value === null || value === h.amount) return;
    try {
      await api.patch(`/wealth/holdings/${h.id}`, {
        amount: Math.round(value * 100) / 100,
      });
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível atualizar o valor."));
    }
  }

  async function remove(h: Holding) {
    if (!window.confirm(`Apagar "${h.label}"?`)) return;
    try {
      await api.delete(`/wealth/holdings/${h.id}`);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível apagar."));
    }
  }

  const fmtMoney = (h: Holding) =>
    h.currency === "USD" ? formatUsd(h.amount) : formatBrl(h.amount);

  return (
    <div className="dashboard-container metrics-page goal-page">
      <div className="metrics-header">
        <div>
          <h1 className="metrics-title">Meta de patrimônio</h1>
          <p className="metrics-sub">
            {data
              ? `${formatUsd(data.goalUsd)} até ${formatDeadline(data.deadline)}`
              : "US$ 2.000.000 até 07/01/2028"}
          </p>
        </div>
        <div className="metrics-actions">
          <button className="btn-secondary" onClick={toggleHidden}>
            {hidden ? "👁 Mostrar valores" : "🙈 Ocultar valores"}
          </button>
          <Link to="/admin" className="btn-secondary">
            Painel
          </Link>
        </div>
      </div>

      {error && (
        <p className="tasks-error" role="alert">
          {error}{" "}
          <button className="btn-secondary" onClick={load}>
            Tentar de novo
          </button>
        </p>
      )}
      {loading && !data && <p className="metrics-sub">Carregando…</p>}

      {data && (
        <>
          <section className="goal-hero">
            <div className="goal-hero-top">
              <div>
                <span className="goal-pct">{data.pct.toLocaleString("pt-BR")}%</span>
                <span className="goal-pct-label">da meta</span>
              </div>
              <div className="goal-days">
                <strong>{data.daysLeft.toLocaleString("pt-BR")}</strong>
                <span>{data.daysLeft === 1 ? "dia restante" : "dias restantes"}</span>
              </div>
            </div>
            <div
              className="goal-track"
              role="progressbar"
              aria-valuenow={Math.round(barWidth(data.pct))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso da meta"
            >
              <div className="goal-fill" style={{ width: `${barWidth(data.pct)}%` }} />
            </div>
            <div className="goal-hero-foot">
              <span>{money(formatUsd(data.totalUsd))} juntados</span>
              <span>meta {formatUsd(data.goalUsd)}</span>
            </div>
          </section>

          <div className="metrics-kpis">
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Já juntei</span>
              <strong>{money(formatUsd(data.totalUsd))}</strong>
              <span className="metrics-kpi-foot">{money(formatBrl(data.totalBrl))}</span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Falta juntar</span>
              <strong>{money(formatUsd(data.remainingUsd))}</strong>
              <span className="metrics-kpi-foot">
                {money(formatBrl(data.remainingUsd * data.rate))}
              </span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Ritmo necessário</span>
              <strong>{money(formatUsd(data.perMonthUsd))}</strong>
              <span className="metrics-kpi-foot">por mês até a data</span>
            </div>
            <div className="metrics-kpi">
              <span className="metrics-kpi-label">Dólar hoje</span>
              <strong>R$ {data.rate.toFixed(2).replace(".", ",")}</strong>
              <span className="metrics-kpi-foot">
                {data.rateInfo.stale ? "cotação antiga (fonte fora do ar)" : "cotação atual"}
              </span>
            </div>
          </div>

          <section className="metrics-card goal-dist">
            <h2 className="tasks-group-title">Onde está concentrado</h2>
            {data.totalUsd > 0 ? (
              <>
                <div className="goal-stack" role="img" aria-label="Distribuição por categoria">
                  {data.byCategory
                    .filter((c) => c.usd > 0)
                    .map((c) => (
                      <div
                        key={c.category}
                        className="goal-stack-seg"
                        style={{ width: `${c.share}%`, background: CATEGORY_INFO[c.category].color }}
                        title={`${CATEGORY_INFO[c.category].label}: ${c.share}%`}
                      />
                    ))}
                </div>
                <ul className="goal-legend">
                  {data.byCategory
                    .filter((c) => c.usd > 0)
                    .sort((a, b) => b.usd - a.usd)
                    .map((c) => (
                      <li key={c.category}>
                        <span className="goal-dot" style={{ background: CATEGORY_INFO[c.category].color }} />
                        <span className="goal-legend-name">{CATEGORY_INFO[c.category].label}</span>
                        <span className="goal-legend-val">
                          {money(formatUsd(c.usd))} · {c.share.toLocaleString("pt-BR")}%
                        </span>
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <p className="metrics-sub">Cadastre seus valores abaixo para ver a distribuição.</p>
            )}
          </section>

          <form className="tasks-form goal-form" onSubmit={add}>
            <select
              className="tasks-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              aria-label="Categoria"
            >
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_INFO[c].label}
                </option>
              ))}
            </select>
            <input
              className="tasks-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nome (ex.: Apartamento, CDB, Bitcoin)"
              maxLength={80}
              aria-label="Nome"
            />
            <input
              className="tasks-input goal-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor (ex.: 150.000,00)"
              inputMode="decimal"
              aria-label="Valor"
            />
            <select
              className="tasks-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "BRL" | "USD")}
              aria-label="Moeda"
            >
              <option value="BRL">R$ (reais)</option>
              <option value="USD">US$ (dólares)</option>
            </select>
            <button className="btn-primary" type="submit" disabled={saving}>
              Adicionar
            </button>
          </form>

          {CATEGORY_ORDER.map((cat) => {
            const items = data.holdings.filter((h) => h.category === cat);
            if (items.length === 0) return null;
            const info = CATEGORY_INFO[cat];
            return (
              <div className="tasks-group" key={cat}>
                <h2 className="tasks-group-title">{info.label}</h2>
                <ul className="tasks-list">
                  {items.map((h) => (
                    <li key={h.id} className="tasks-item" style={{ borderLeftColor: info.color }}>
                      <div className="tasks-item-body">
                        <span className="tasks-item-title">{h.label}</span>
                        <span className="tasks-item-meta">
                          {money(formatUsd(h.usd))}
                          {h.currency === "BRL" && " (convertido)"}
                        </span>
                      </div>
                      {editId === h.id ? (
                        <input
                          className="tasks-input goal-edit"
                          value={editValue}
                          autoFocus
                          inputMode="decimal"
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveEdit(h)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(h);
                            if (e.key === "Escape") setEditId(null);
                          }}
                          aria-label={`Novo valor de ${h.label}`}
                        />
                      ) : (
                        <button
                          className="goal-value"
                          onClick={() => {
                            setEditId(h.id);
                            setEditValue(String(h.amount).replace(".", ","));
                          }}
                          title="Clique para editar o valor"
                        >
                          {money(fmtMoney(h))} ✎
                        </button>
                      )}
                      <button className="tasks-remove" onClick={() => remove(h)} aria-label="Apagar">
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {data.holdings.length === 0 && (
            <div className="tasks-empty">
              <strong>Nenhum valor cadastrado ainda.</strong>
              <span>Adicione o que você já tem em imóveis, banco, ações, cripto e outros.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

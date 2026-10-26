import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import YoutubeMetricsPanel from "../components/YoutubeMetricsPanel";
import { PERIODS, type YoutubeResponse } from "../services/youtubeMetrics";
import "../styles/style.css";

export default function Metrics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<YoutubeResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get<YoutubeResponse>("/metrics/youtube", {
          params: { days },
        });
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(err, "Não foi possível carregar as métricas."),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [days, attempt]);

  return (
    <div className="dashboard-container metrics-page">
      <div className="metrics-header">
        <div>
          <h1 className="metrics-title">Métricas do YouTube</h1>
          <p className="metrics-sub">Desempenho dos canais do estúdio</p>
        </div>

        <div className="metrics-actions">
          <div className="metrics-periods" role="group" aria-label="Período">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                className={`metrics-period${days === p.days ? " active" : ""}`}
                aria-pressed={days === p.days}
                onClick={() => setDays(p.days)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Link to="/admin" className="btn-secondary">
            ← Painel
          </Link>
        </div>
      </div>

      {error && (
        <p className="metrics-note metrics-error">
          {error}{" "}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Tentar de novo
          </button>
        </p>
      )}

      {!data && loading && <p className="metrics-note">Carregando…</p>}

      {data && (
        <YoutubeMetricsPanel
          data={data}
          days={days}
          loading={loading}
          showSetupHint
        />
      )}
    </div>
  );
}

import {
  formatCompact,
  formatPct,
  minutesToHours,
  pctChange,
  sparkline,
} from "../services/metricsFormat";
import type { Totals, YoutubeResponse } from "../services/youtubeMetrics";

// Painel de métricas dos canais. É usado no painel do admin (/admin/metrics)
// e na página pública (/youtube), para os dois mostrarem os mesmos números.

const nf = new Intl.NumberFormat("pt-BR");

function Delta({ current, previous }: { current: number; previous: number }) {
  const p = pctChange(current, previous);
  if (p === null) return <span className="metrics-delta neutral">—</span>;
  const cls = p > 0 ? "up" : p < 0 ? "down" : "neutral";
  const arrow = p > 0 ? "▲" : p < 0 ? "▼" : "•";
  return (
    <span
      className={`metrics-delta ${cls}`}
      title="Comparado ao período anterior"
    >
      {arrow} {formatPct(p)}
    </span>
  );
}

function Spark({ values }: { values: number[] }) {
  const { line, area } = sparkline(values, 300, 64);
  if (!line) return null;
  return (
    <svg
      className="metrics-spark"
      viewBox="0 0 300 64"
      preserveAspectRatio="none"
      role="img"
      aria-label="Visualizações por dia"
    >
      <path d={area} className="metrics-spark-area" />
      <path d={line} className="metrics-spark-line" />
    </svg>
  );
}

interface Props {
  data: YoutubeResponse;
  days: number;
  loading?: boolean;
  // Só o painel interno mostra o aviso sobre a autorização dos canais.
  showSetupHint?: boolean;
}

export default function YoutubeMetricsPanel({
  data,
  days,
  loading = false,
  showSetupHint = false,
}: Props) {
  const channels = data.channels ?? [];
  const withPeriod = channels.filter((c) => c.period);

  const sum = (pick: (t: Totals) => number, which: "current" | "previous") =>
    withPeriod.reduce((s, c) => s + pick(c.period![which]), 0);

  const views = {
    cur: sum((t) => t.views, "current"),
    prev: sum((t) => t.views, "previous"),
  };
  const mins = {
    cur: sum((t) => t.minutesWatched, "current"),
    prev: sum((t) => t.minutesWatched, "previous"),
  };
  const net = (w: "current" | "previous") =>
    sum((t) => t.subscribersGained - t.subscribersLost, w);
  const totalSubs = channels.reduce((s, c) => s + (c.subscribers ?? 0), 0);
  const hasPeriod = withPeriod.length > 0;

  return (
    <div className={loading ? "metrics-content loading" : "metrics-content"}>
      <div className="metrics-kpis">
        <div className="metrics-kpi">
          <span className="metrics-kpi-label">Inscritos (total)</span>
          <strong>{nf.format(totalSubs)}</strong>
          {hasPeriod && (
            <span className="metrics-kpi-foot">
              {net("current") >= 0 ? "+" : ""}
              {nf.format(net("current"))} no período{" "}
              <Delta current={net("current")} previous={net("previous")} />
            </span>
          )}
        </div>

        <div className="metrics-kpi">
          <span className="metrics-kpi-label">Visualizações no período</span>
          <strong>{hasPeriod ? formatCompact(views.cur) : "—"}</strong>
          {hasPeriod && (
            <span className="metrics-kpi-foot">
              <Delta current={views.cur} previous={views.prev} />
            </span>
          )}
        </div>

        <div className="metrics-kpi">
          <span className="metrics-kpi-label">Horas assistidas</span>
          <strong>{hasPeriod ? nf.format(minutesToHours(mins.cur)) : "—"}</strong>
          {hasPeriod && (
            <span className="metrics-kpi-foot">
              <Delta current={mins.cur} previous={mins.prev} />
            </span>
          )}
        </div>

        <div className="metrics-kpi">
          <span className="metrics-kpi-label">Visualizações (total)</span>
          <strong>
            {formatCompact(channels.reduce((s, c) => s + c.views, 0))}
          </strong>
          <span className="metrics-kpi-foot">desde a criação dos canais</span>
        </div>
      </div>

      {!hasPeriod && showSetupHint && (
        <p className="metrics-note">
          Os números por período (30 dias, 90 dias, 1 ano) precisam da
          autorização de cada canal na API. Enquanto isso, aparecem só os
          totais.
        </p>
      )}

      <div className="metrics-grid">
        {channels.map((c) => {
          const p = c.period;
          return (
            <article key={c.id} className="metrics-card">
              <header className="metrics-card-head">
                {c.thumbnail && <img src={c.thumbnail} alt="" />}
                <div>
                  <h3>{c.title}</h3>
                  {c.handle && <small>{c.handle}</small>}
                </div>
              </header>

              {p ? (
                <>
                  <div className="metrics-card-main">
                    <div>
                      <span className="metrics-card-label">
                        Visualizações · {days === 365 ? "1 ano" : `${days} dias`}
                      </span>
                      <strong>{nf.format(p.current.views)}</strong>
                    </div>
                    <Delta
                      current={p.current.views}
                      previous={p.previous.views}
                    />
                  </div>
                  <Spark values={p.daily.map((d) => d.views)} />
                </>
              ) : (
                <p className="metrics-card-empty">
                  Números do período indisponíveis para este canal.
                </p>
              )}

              <dl className="metrics-stats">
                <div>
                  <dt>Inscritos</dt>
                  <dd>
                    {c.subscribers === null ? "oculto" : nf.format(c.subscribers)}
                  </dd>
                </div>
                {p && (
                  <div>
                    <dt>Novos inscritos</dt>
                    <dd>
                      {nf.format(
                        p.current.subscribersGained - p.current.subscribersLost,
                      )}
                    </dd>
                  </div>
                )}
                {p && (
                  <div>
                    <dt>Horas assistidas</dt>
                    <dd>{nf.format(minutesToHours(p.current.minutesWatched))}</dd>
                  </div>
                )}
                <div>
                  <dt>Vídeos</dt>
                  <dd>{nf.format(c.videos)}</dd>
                </div>
                <div>
                  <dt>Views (total)</dt>
                  <dd>{nf.format(c.views)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      <p className="metrics-note">
        Atualizado em {new Date(data.updatedAt).toLocaleString("pt-BR")}
        {data.stale && " (dados em cache: o YouTube não respondeu agora)"}. Os
        dados por período têm até 2 dias de atraso e a comparação é com o
        período imediatamente anterior.
      </p>
    </div>
  );
}

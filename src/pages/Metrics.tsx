import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import "../styles/style.css";

interface Channel {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  subscribers: number | null;
  views: number;
  videos: number;
}

interface YoutubeResponse {
  updatedAt: string;
  stale?: boolean;
  channels: Channel[];
}

const nf = new Intl.NumberFormat("pt-BR");

export default function Metrics() {
  const [data, setData] = useState<YoutubeResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<YoutubeResponse>("/metrics/youtube");
      setData(res.data);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Não foi possível carregar as métricas."),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const channels = data?.channels ?? [];
  const totalSubs = channels.reduce((s, c) => s + (c.subscribers ?? 0), 0);
  const totalViews = channels.reduce((s, c) => s + c.views, 0);

  return (
    <div className="dashboard-container metrics-page">
      <div className="dashboard-topbar">
        <h1 className="dashboard-title">Métricas — YouTube</h1>
        <Link to="/admin" className="btn-secondary">
          ← Painel
        </Link>
      </div>

      {loading && <p className="metrics-note">Carregando…</p>}

      {error && (
        <p className="metrics-note metrics-error">
          {error}{" "}
          <button type="button" className="btn-secondary" onClick={load}>
            Tentar de novo
          </button>
        </p>
      )}

      {data && (
        <>
          <div className="metrics-totals">
            <div className="metrics-total">
              <span>Inscritos (total)</span>
              <strong>{nf.format(totalSubs)}</strong>
            </div>
            <div className="metrics-total">
              <span>Visualizações (total)</span>
              <strong>{nf.format(totalViews)}</strong>
            </div>
          </div>

          <div className="metrics-grid">
            {channels.map((c) => (
              <div key={c.id} className="metrics-card">
                <div className="metrics-card-head">
                  {c.thumbnail && <img src={c.thumbnail} alt="" />}
                  <div>
                    <h3>{c.title}</h3>
                    {c.handle && <small>{c.handle}</small>}
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Inscritos</dt>
                    <dd>
                      {c.subscribers === null
                        ? "oculto"
                        : nf.format(c.subscribers)}
                    </dd>
                  </div>
                  <div>
                    <dt>Visualizações</dt>
                    <dd>{nf.format(c.views)}</dd>
                  </div>
                  <div>
                    <dt>Vídeos</dt>
                    <dd>{nf.format(c.videos)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <p className="metrics-note">
            Atualizado em {new Date(data.updatedAt).toLocaleString("pt-BR")}
            {data.stale && " (dados em cache: o YouTube não respondeu agora)"}.
            Os números são atualizados a cada 10 minutos.
          </p>
        </>
      )}
    </div>
  );
}

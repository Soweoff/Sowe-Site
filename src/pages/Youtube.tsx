import { useEffect, useState } from "react";
import { usePageTitle } from "../services/usePageTitle";
import { api } from "../services/api";
import YoutubeMetricsPanel from "../components/YoutubeMetricsPanel";
import { PERIODS, type YoutubeResponse } from "../services/youtubeMetrics";

interface ChannelData {
  id: string;
  subs: number;
  views: number;
}

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxF6IP6q0JIFZoyAqjiPTW5oBw1vYLxkNJoAL7E9ky_10ajRztHkVuMk95zKxVoQEmFng/exec";

const CHANNELS = [
  {
    id: "UCxwte-dvs1WgDN1okSweY3g",
    name: "Sowe VFX",
    url: "https://www.youtube.com/@Sowevfx",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1769353632/Sowe-Site/Imagem_do_WhatsApp_de_2025-12-14_%C3%A0_s_00.53.30_ea29c35f_wwn1ze.jpg",
  },
  {
    id: "UCYoE3K0i6DBznVicn7pOmww",
    name: "Lil Sowe",
    url: "https://www.youtube.com/@LiLSoweoff",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1769353606/Sowe-Site/Imagem_do_WhatsApp_de_2025-03-30_%C3%A0_s_23.31.38_23867bab_xskp2y.jpg",
  },
  {
    id: "UCMQL_xF785CLONsDaASzUmQ",
    name: "Soweoff",
    url: "https://www.youtube.com/@Sowe_off",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1769353642/Sowe-Site/Art-WhatsApp_dcoss1.png",
  },
];

const fmt = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("pt-BR") : "...";

export default function Youtube() {
  usePageTitle("Canais do YouTube");

  // Reserva: números simples vindos do Google Apps Script. Servem enquanto a
  // API ainda acorda (o servidor gratuito pode demorar) ou se ela falhar.
  const [fallback, setFallback] = useState<Record<string, ChannelData>>({});

  const [days, setDays] = useState(30);
  const [metrics, setMetrics] = useState<YoutubeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function fetchFallback() {
      try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data: ChannelData[] = await response.json();

        const mapped: Record<string, ChannelData> = {};
        data.forEach((channel) => {
          mapped[channel.id] = channel;
        });

        setFallback(mapped);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchFallback();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setFailed(false);
        const res = await api.get<YoutubeResponse>("/public/metrics/youtube", {
          params: { days },
        });
        if (!cancelled) setMetrics(res.data);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
        if (!cancelled) setFailed(true);
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
    <>
      {/* MAIN */}
      <main>
        <div className="content">
          <h1>
            3 CANAIS <br /> NO YOUTUBE
          </h1>

          <p className="description">
            Criador de conteúdo com 3 canais focados em edição, VFX, 3D,
            tecnologia e CS2.
          </p>
        </div>

        <section className="youtube-section">
          <h2>Meus Canais no YouTube</h2>

          <div className="youtube-list">
            {CHANNELS.map((channel) => {
              const live = metrics?.channels.find((c) => c.id === channel.id);
              const backup = fallback[channel.id];
              const subs = live ? live.subscribers : backup?.subs;
              const views = live ? live.views : backup?.views;

              return (
                <div className="youtube-card" key={channel.id}>
                  <img
                    className="channel-avatar"
                    src={channel.avatar}
                    alt={channel.name}
                  />
                  <div className="channel-info">
                    <h3>{channel.name}</h3>
                    <p>
                      {live && live.subscribers === null
                        ? "inscritos ocultos"
                        : `${fmt(subs)} inscritos`}{" "}
                      • {fmt(views)} views totais
                      {live ? ` • ${fmt(live.videos)} vídeos` : ""}
                    </p>
                  </div>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-button"
                  >
                    Ver canal
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="youtube-metrics">
          <div className="youtube-metrics-head">
            <h2>Desempenho dos canais</h2>

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
          </div>

          {!metrics && loading && (
            <p className="metrics-note">Carregando os números…</p>
          )}

          {failed && (
            <p className="metrics-note">
              Não foi possível carregar os números detalhados agora.{" "}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Tentar de novo
              </button>
            </p>
          )}

          {metrics && (
            <YoutubeMetricsPanel
              data={metrics}
              days={days}
              loading={loading}
            />
          )}
        </section>
      </main>
    </>
  );
}

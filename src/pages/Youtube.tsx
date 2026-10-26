import { useEffect, useState } from "react";
import { usePageTitle } from "../services/usePageTitle";
import { api } from "../services/api";

interface ChannelData {
  id: string;
  subs: number;
  views: number;
}

interface LiveChannel {
  id: string;
  subscribers: number | null; // null quando o canal esconde os inscritos
  views: number;
  videos: number;
}

interface LiveResponse {
  channels: LiveChannel[];
}

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxF6IP6q0JIFZoyAqjiPTW5oBw1vYLxkNJoAL7E9ky_10ajRztHkVuMk95zKxVoQEmFng/exec";

const CHANNELS = [
  {
    id: "UCxwte-dvs1WgDN1okSweY3g",
    name: "Sowe Studio",
    url: "https://www.youtube.com/@Sowe_Studio",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1792644563/Sowe-Site/Emblema-Dourado-Sowe-Studio_brasao_sgukbw.png",
  },
  {
    id: "UCYoE3K0i6DBznVicn7pOmww",
    name: "Cortes Do Sowe",
    url: "https://www.youtube.com/@CortesDoSowe",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1792984235/Sowe-Site/Emblema_Circular_CORTES_DO_SOWE_1_dxeyfp.png",
  },
  {
    id: "UCMQL_xF785CLONsDaASzUmQ",
    name: "Soweoff",
    url: "https://www.youtube.com/@Sowe_off",
    avatar:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1792984417/Sowe-Site/Retrato_profissional_em_fundo_dourado_intensos_npw19j.png",
  },
];

const fmt = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("pt-BR") : "...";

export default function Youtube() {
  usePageTitle("Canais do YouTube");

  // Números ao vivo, direto da API do YouTube (via backend, com cache de 10 min).
  const [live, setLive] = useState<Record<string, LiveChannel>>({});

  // Reserva: números do Google Apps Script. Aparecem enquanto a API acorda (o
  // servidor gratuito pode demorar) ou se ela falhar.
  const [fallback, setFallback] = useState<Record<string, ChannelData>>({});

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await api.get<LiveResponse>("/public/metrics/youtube");
        const mapped: Record<string, LiveChannel> = {};
        res.data.channels.forEach((channel) => {
          mapped[channel.id] = channel;
        });
        setLive(mapped);
      } catch (error) {
        console.error("Erro ao carregar dados do YouTube:", error);
      }
    }

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

    fetchLive();
    fetchFallback();
  }, []);

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
              const liveData = live[channel.id];
              const backup = fallback[channel.id];
              const subs = liveData ? liveData.subscribers : backup?.subs;
              const views = liveData ? liveData.views : backup?.views;

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
                      {liveData && liveData.subscribers === null
                        ? "inscritos ocultos"
                        : `${fmt(subs)} inscritos`}{" "}
                      • {fmt(views)} views totais
                      {liveData ? ` • ${fmt(liveData.videos)} vídeos` : ""}
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
      </main>
    </>
  );
}

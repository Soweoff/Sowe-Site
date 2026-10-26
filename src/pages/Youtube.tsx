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

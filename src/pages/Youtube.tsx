import { useEffect, useState } from "react";

interface ChannelData {
  id: string;
  subs: number;
  views: number;
}

export default function Youtube() {
  const [channels, setChannels] = useState<Record<string, ChannelData>>({});

  useEffect(() => {
    async function fetchAllChannels() {
      const APPS_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbxF6IP6q0JIFZoyAqjiPTW5oBw1vYLxkNJoAL7E9ky_10ajRztHkVuMk95zKxVoQEmFng/exec";

      try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data: ChannelData[] = await response.json();

        const mapped: Record<string, ChannelData> = {};

        data.forEach((channel) => {
          mapped[channel.id] = channel;
        });

        setChannels(mapped);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchAllChannels();
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
            {/* Sowe VFX */}
            <div className="youtube-card">
              <img
                className="channel-avatar"
                src="https://res.cloudinary.com/dvqbwddan/image/upload/v1769353632/Sowe-Site/Imagem_do_WhatsApp_de_2025-12-14_%C3%A0_s_00.53.30_ea29c35f_wwn1ze.jpg"
                alt="Sowe VFX"
              />
              <div className="channel-info">
                <h3>Sowe VFX</h3>
                <p>
                  {channels["UCxwte-dvs1WgDN1okSweY3g"]?.subs?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  inscritos •{" "}
                  {channels["UCxwte-dvs1WgDN1okSweY3g"]?.views?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  views totais
                </p>
              </div>
              <a
                href="https://www.youtube.com/@Sowevfx"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-button"
              >
                Ver canal
              </a>
            </div>

            {/* Lil Sowe */}
            <div className="youtube-card">
              <img
                className="channel-avatar"
                src="https://res.cloudinary.com/dvqbwddan/image/upload/v1769353606/Sowe-Site/Imagem_do_WhatsApp_de_2025-03-30_%C3%A0_s_23.31.38_23867bab_xskp2y.jpg"
                alt="Lil Sowe"
              />
              <div className="channel-info">
                <h3>Lil Sowe</h3>
                <p>
                  {channels["UCYoE3K0i6DBznVicn7pOmww"]?.subs?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  inscritos •{" "}
                  {channels["UCYoE3K0i6DBznVicn7pOmww"]?.views?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  views totais
                </p>
              </div>
              <a
                href="https://www.youtube.com/@LiLSoweoff"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-button"
              >
                Ver canal
              </a>
            </div>

            {/* Soweoff */}
            <div className="youtube-card">
              <img
                className="channel-avatar"
                src="https://res.cloudinary.com/dvqbwddan/image/upload/v1769353642/Sowe-Site/Art-WhatsApp_dcoss1.png"
                alt="Soweoff"
              />
              <div className="channel-info">
                <h3>Soweoff</h3>
                <p>
                  {channels["UCMQL_xF785CLONsDaASzUmQ"]?.subs?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  inscritos •{" "}
                  {channels["UCMQL_xF785CLONsDaASzUmQ"]?.views?.toLocaleString(
                    "pt-BR",
                  ) || "..."}{" "}
                  views totais
                </p>
              </div>
              <a
                href="https://www.youtube.com/@Sowe_off"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-button"
              >
                Ver canal
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

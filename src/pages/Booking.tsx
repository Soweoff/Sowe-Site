import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { api } from "../services/api";
import { formatDay, formatLong } from "../services/bookingFormat";
import "../styles/style.css";
import { usePageTitle } from "../services/usePageTitle";

interface DaySlots {
  date: string;
  times: string[];
}

interface SlotsResponse {
  days: DaySlots[];
}

function errorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Não foi possível conectar ao servidor. Ele pode estar iniciando (leva até 1 minuto). Tente novamente.";
    }
    if (err.response.status === 409) {
      return "Esse horário acabou de ser reservado. Escolha outro.";
    }
    if (err.response.status === 429) {
      return "Muitas tentativas. Tente de novo mais tarde ou chame no WhatsApp.";
    }
    const msg = err.response.data?.message;
    if (Array.isArray(msg)) return msg.join(" ");
    if (typeof msg === "string") return msg;
  }
  return "Não foi possível enviar o pedido. Tente novamente.";
}

export default function Booking() {
  usePageTitle("Agendar uma conversa");

  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [website, setWebsite] = useState(""); // campo-isca (robôs preenchem)

  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState("");

  async function loadSlots() {
    try {
      setLoading(true);
      setLoadError("");
      const res = await api.get<SlotsResponse>("/booking/slots");
      setDays(res.data.days);
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  const times = days.find((d) => d.date === date)?.times ?? [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date || !time) return;

    try {
      setSending(true);
      setFormError("");
      await api.post("/booking", {
        name,
        contact,
        subject: subject || undefined,
        start: `${date}T${time}`,
        website,
      });
      setSent(formatLong(`${date}T${time}`));
    } catch (err) {
      setFormError(errorMessage(err));
      if (isAxiosError(err) && err.response?.status === 409) {
        setTime("");
        loadSlots();
      }
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section className="booking-section">
        <div className="booking-container">
          <div className="booking-card booking-done">
            <h2>Pedido enviado!</h2>
            <p>
              Você pediu uma conversa para <strong>{sent}</strong>.
            </p>
            <p>
              Vou analisar e confirmar pelo contato que você informou. O horário
              só fica garantido depois da minha confirmação.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-section">
      <div className="booking-container">
        <h2 className="portfolio-title">Agendar uma conversa</h2>
        <p className="portfolio-subtitle">
          Escolha um horário para falarmos sobre o seu projeto. Cada conversa
          dura 1 hora e é confirmada por mim.
        </p>

        {loading && <p className="booking-note">Carregando horários…</p>}

        {loadError && (
          <p className="booking-note booking-error">
            {loadError}{" "}
            <button type="button" className="btn-secondary" onClick={loadSlots}>
              Tentar de novo
            </button>
          </p>
        )}

        {!loading && !loadError && days.length === 0 && (
          <p className="booking-note">
            Não há horários livres nos próximos dias. Chame no WhatsApp.
          </p>
        )}

        {days.length > 0 && (
          <div className="booking-card">
            <h3 className="booking-step">1. Escolha o dia</h3>
            <div className="booking-days">
              {days.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  className={`booking-chip${date === d.date ? " active" : ""}`}
                  aria-pressed={date === d.date}
                  onClick={() => {
                    setDate(d.date);
                    setTime("");
                  }}
                >
                  {formatDay(d.date)}
                </button>
              ))}
            </div>

            {date && (
              <>
                <h3 className="booking-step">2. Escolha o horário</h3>
                <div className="booking-days">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`booking-chip${time === t ? " active" : ""}`}
                      aria-pressed={time === t}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="booking-note">Horário de Brasília.</p>
              </>
            )}

            {date && time && (
              <form onSubmit={handleSubmit} className="booking-form">
                <h3 className="booking-step">3. Seus dados</h3>

                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={80}
                />
                <input
                  type="text"
                  placeholder="WhatsApp (com DDD) ou e-mail"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  maxLength={120}
                />
                <textarea
                  placeholder="Sobre o que você quer conversar? (opcional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={500}
                  rows={3}
                />

                {/* Campo-isca: invisível para pessoas. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="booking-trap"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />

                {formError && (
                  <p className="booking-note booking-error">{formError}</p>
                )}

                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending
                    ? "Enviando..."
                    : `Pedir ${formatDay(date)} às ${time}`}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

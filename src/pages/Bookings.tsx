import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import { formatLong, whatsappLink } from "../services/bookingFormat";
import "../styles/style.css";

interface Pending {
  id: string;
  name: string;
  contact: string;
  subject: string;
  start: string;
  end: string;
}

export default function Bookings() {
  const [items, setItems] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState<{ text: string; href: string | null } | null>(
    null,
  );

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<Pending[]>("/booking/admin/pending");
      setItems(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível carregar os pedidos."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(item: Pending) {
    try {
      setBusyId(item.id);
      await api.post(`/booking/admin/${item.id}/approve`);
      const when = formatLong(item.start);
      setNotice({
        text: `Reunião com ${item.name} confirmada para ${when}.`,
        href: whatsappLink(
          item.contact,
          `Olá, ${item.name}! Sua conversa com o Sowe Studio está confirmada para ${when}. Até lá!`,
        ),
      });
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível aprovar."));
    } finally {
      setBusyId("");
    }
  }

  async function reject(item: Pending) {
    if (!window.confirm(`Recusar o pedido de ${item.name}? O horário volta a ficar livre.`)) {
      return;
    }
    try {
      setBusyId(item.id);
      await api.delete(`/booking/admin/${item.id}`);
      const when = formatLong(item.start);
      setNotice({
        text: `Pedido de ${item.name} recusado. O horário voltou a ficar livre.`,
        href: whatsappLink(
          item.contact,
          `Olá, ${item.name}! Não consigo atender ${when}. Podemos combinar outro horário?`,
        ),
      });
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível recusar."));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="dashboard-container metrics-page">
      <div className="metrics-header">
        <div>
          <h1 className="metrics-title">Pedidos de agendamento</h1>
          <p className="metrics-sub">Aprove ou recuse as conversas pedidas pelo site</p>
        </div>
        <Link to="/admin" className="btn-secondary">
          ← Painel
        </Link>
      </div>

      {notice && (
        <p className="booking-note booking-notice">
          {notice.text}{" "}
          {notice.href && (
            <a href={notice.href} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Avisar no WhatsApp
            </a>
          )}
        </p>
      )}

      {error && <p className="metrics-note metrics-error">{error}</p>}
      {loading && <p className="metrics-note">Carregando…</p>}

      {!loading && items.length === 0 && !error && (
        <p className="metrics-note">Nenhum pedido aguardando aprovação.</p>
      )}

      <div className="booking-list">
        {items.map((item) => (
          <article key={item.id} className="metrics-card">
            <h3>{item.name}</h3>
            <p className="booking-when">{formatLong(item.start)}</p>
            <dl className="metrics-stats">
              <div>
                <dt>Contato</dt>
                <dd>{item.contact}</dd>
              </div>
              <div>
                <dt>Assunto</dt>
                <dd>{item.subject}</dd>
              </div>
            </dl>
            <div className="portfolio-buttons">
              <button
                type="button"
                className="btn-primary"
                disabled={busyId === item.id}
                onClick={() => approve(item)}
              >
                Aprovar
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={busyId === item.id}
                onClick={() => reject(item)}
              >
                Recusar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

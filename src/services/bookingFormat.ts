// Funções puras do agendamento (fáceis de testar).

// "2026-10-22" → "qui., 22/10" (meio-dia evita problemas de fuso).
export function formatDay(date: string): string {
  return new Date(`${date}T12:00:00`)
    .toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    })
    .replace(",", "");
}

// "2026-10-22T14:00" → "quinta-feira, 22 de outubro às 14:00"
export function formatLong(start: string): string {
  const day = new Date(`${start.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "numeric", month: "long" },
  );
  return `${day} às ${start.slice(11, 16)}`;
}

// Telefone brasileiro (com ou sem 55) → "5542999990000"; e-mail → null.
export function phoneDigits(contact: string): string | null {
  if (contact.includes("@")) return null;
  const digits = contact.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    return digits;
  }
  return null;
}

export function whatsappLink(contact: string, message: string): string | null {
  const phone = phoneDigits(contact);
  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;
}

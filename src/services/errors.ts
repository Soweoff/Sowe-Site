import { isAxiosError } from "axios";

// Converte um erro da API numa mensagem amigável para mostrar ao usuário.
// `fallback` é usado quando não há uma mensagem mais específica.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;

  // Sem resposta: sem internet ou API fora do ar. No plano gratuito do Render
  // a API "dorme" e leva cerca de 1 minuto para acordar.
  if (!error.response) {
    return "Não foi possível conectar ao servidor. Ele pode estar iniciando (leva até 1 minuto). Tente novamente.";
  }

  const { status, data } = error.response;

  if (status === 429) {
    return typeof data?.message === "string"
      ? data.message
      : "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }

  if (status === 409) return "Este e-mail já está cadastrado.";

  return fallback;
}

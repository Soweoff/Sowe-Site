import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se a API responder 401 (token expirado ou inválido) fora das rotas de
// login/cadastro, encerramos a sessão e levamos para o login, em vez de
// deixar a tela falhando em silêncio.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    if (status === 401 && !url.includes("/auth/")) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

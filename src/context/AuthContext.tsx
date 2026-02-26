import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }

  let decoded: DecodedToken | null = null;

  try {
    if (storedToken) {
      decoded = jwtDecode<DecodedToken>(storedToken);
    }
  } catch {
    localStorage.removeItem("token");
  }

  const [token, setToken] = useState<string | null>(storedToken);
  const [role, setRole] = useState<string | null>(decoded?.role ?? null);

  async function login(email: string, password: string) {
    const response = await api.post("/v1/auth/login", {
      email,
      password,
    });

    const accessToken = response.data.access_token;
    const decodedToken = jwtDecode<DecodedToken>(accessToken);

    localStorage.setItem("token", accessToken);

    // 🔥 IMPORTANTE
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setToken(accessToken);
    setRole(decodedToken.role);
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post("/v1/auth/register", {
      name,
      email,
      password,
    });

    const accessToken = response.data.access_token;

    localStorage.setItem("token", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setToken(accessToken);
  }

  function logout() {
    localStorage.removeItem("token");

    // 🔥 IMPORTANTE
    delete api.defaults.headers.common["Authorization"];

    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

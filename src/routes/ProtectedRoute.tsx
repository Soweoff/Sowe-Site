import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  role: string;
}

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // 👈 opcional
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, logout, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      logout();
      return <Navigate to="/login" replace />;
    }

    // 🔥 Validação de ROLE
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      return <Navigate to="/" replace />;
    }
  } catch {
    logout();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

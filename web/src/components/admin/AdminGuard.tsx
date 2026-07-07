import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isAdmin =
      payload.role === "SUPER_ADMIN" || payload.role === "STORE_ADMIN";

    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }
}

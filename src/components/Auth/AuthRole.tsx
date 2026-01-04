import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

type Role = "admin" | "client" | "triparty";

interface AuthGuardProps {
  allowedRoles: Role[];
}

export default function AuthGuard({ allowedRoles }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/role");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

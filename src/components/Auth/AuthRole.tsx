import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

type Role = "admin" | "client" | "triparty";

interface AuthGuardProps {
  allowedRoles: Role[];
}

export default function AuthGuard({ allowedRoles }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role: Role } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // First check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/auth/role");
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Only clear token if it's definitely invalid (401)
        if ((error as any)?.response?.status === 401) {
          localStorage.removeItem("token");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

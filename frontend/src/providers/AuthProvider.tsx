"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { type ReactNode } from "react";
import api from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  token: string | null;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({} as User);
  const [token, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(token);
  const location = useLocation();
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
  if (!baseURL) {
    throw new Error("VITE_PUBLIC_API_URL is not defined");
  }


  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useLayoutEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = tokenRef.current;
        if (currentToken) {
          config.headers["Authorization"] = `Bearer ${currentToken}`;
        }else{
          setToken(null);
          setUser({} as User);
          if(location.pathname!=='/login'){
            navigate('/login');
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (error.response && status === 401) {
          setToken(null);
          setUser({} as User);
          if(location.pathname!=='/login'){
            navigate('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [baseURL]);

  const value = { user, setUser, token, setToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}


export function useRouteGuard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth initialization (silent refresh) to complete before making routing decisions

    const isAuthenticated = !!token;
    console.log("[auth] route guard check:", { isAuthenticated, location });
    const isLoginPage = location.pathname === "/auth/login";
    // const isAuthPage = pathname?.startsWith("/auth/");

    // If logged in and on login page, redirect to dashboard
    if (isAuthenticated && isLoginPage) {
      navigate("/dashboard");
      return;
    }

    // If NOT logged in and NOT on any auth page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      navigate("/auth/login");
      return;
    }

    // No redirect needed, clear loading state
    setIsLoading(false);
  }, [token, location, navigate]);

  return { isLoading, isAuthenticated: !!token };
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading } = useRouteGuard();

  // While checking auth and potentially redirecting, show nothing
  // This prevents flashing the page content before redirect
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

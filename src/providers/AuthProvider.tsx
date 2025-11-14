"use client";
import { createContext, useState, useContext, useEffect, useRef, useLayoutEffect } from "react";
import { type ReactNode } from "react";
import api from "../lib/api";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export type User = {
  id: number;
  email: string;
  provider: string;
  socialId: number | null;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  authInitialized: boolean;
  // api: typeof api;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({} as User);
  // Keep the access token in memory only (for improved security).
  // The token will not be persisted to localStorage.
  const [token, setToken] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
  if(!baseURL){
    throw new Error("VITE_PUBLIC_API_URL is not defined");
  }

  // Keep a ref to the latest token so interceptors (attached once) always read the current value
  const tokenRef = useRef<string | null>(token);

  useEffect(() => {
    // keep ref up-to-date so interceptors (attached once) read latest token
    tokenRef.current = token;
  }, [token]);

  // On mount, try to silently refresh the access token if a refresh token exists.
  // This prevents redirecting to login immediately when the app loads.
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setAuthInitialized(true);
        return;
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        setAuthInitialized(true);
        return;
      }

      try {
        const { data } = await axios.post(
          "/auth/refresh",
          {},
          {
            baseURL,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { token: resToken, refreshToken: newRefresh } = data;
        tokenRef.current = resToken;
        setToken(resToken);
        try {
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        } catch (e) {
          /* ignore */
        }

        // Try to fetch the user after refresh
        try {
          const { data: me } = await api.get("/auth/me");
          setUser(me);
        } catch (e) {
          /* ignore */
        }
      } catch (e) {
        try {
          localStorage.removeItem("refreshToken");
        } catch (err) {
          /* ignore */
        }
      } finally {
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  useLayoutEffect(() => {
    // Attach interceptors once and as early as possible,
    // so initial child effects (e.g., first API call) are covered.
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = tokenRef.current;
        if (currentToken) {
          // normalize headers to a plain object so we can set Authorization in a type-safe way
          config.headers = { ...(config.headers as any) } as any;
          (config.headers as any)["Authorization"] = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        if (!originalRequest) return Promise.reject(error);

        // debug: log error info to help trace why refresh is not attempted
        try {
          // using console.debug so it's easy to filter; these logs can be removed later
          console.debug("[auth] response interceptor error for", {
            url: originalRequest.url,
            baseURL: originalRequest.baseURL || baseURL,
            status: error?.response?.status,
            hasRetryFlag: !!originalRequest._retry,
            tokenRef: tokenRef.current,
            refreshTokenInStorage: typeof window !== "undefined" ? !!localStorage.getItem("refreshToken") : false,
          });
        } catch (e) {
          /* ignore logging errors */
        }

        // Don't try to refresh if the failed request is the refresh endpoint itself
        if (originalRequest.url && originalRequest.url.includes("/auth/refresh")) {
          return Promise.reject(error);
        }

        // Only attempt refresh once per request
        const status = error?.response?.status;
        if (error.response && status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

            console.debug("[auth] attempting refresh, refreshToken present:", !!refreshToken);

            const { data } = await axios.post(
              "/auth/refresh",
              {},
              {
                baseURL,
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              },
            );

            const { token: resToken, refreshToken: newRefresh } = data;
            // Update in-memory token ref immediately so the retried request includes it.
            tokenRef.current = resToken;
            setToken(resToken);
            try {
              localStorage.setItem("refreshToken", newRefresh);
            } catch (e) {
              /* ignore */
            }

            const res = await api.get("/auth/me")
            setUser(res.data);

            // ensure headers is a plain object before mutating
            originalRequest.headers = { ...(originalRequest.headers as any) } as any;
            (originalRequest.headers as any)["Authorization"] = `Bearer ${resToken}`;
            console.debug("[auth] refresh successful, retrying original request with new token");
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setToken(null);
            try {
              localStorage.removeItem("refreshToken");
            } catch (e) {
              /* ignore */
            }
            // navigate to login page (client-side)
            if (typeof window !== "undefined") window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [baseURL]);

  const value = { user, setUser, token, setToken, authInitialized, /* api */ };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

/**
 * Hook to guard routes based on authentication status.
 * - If user is logged in AND accessing /auth/login, redirect to /dashboard
 * - If user is NOT logged in AND NOT on /auth/login, redirect to /auth/login
 * Returns { isLoading, isAuthenticated } for conditional rendering.
 */
export function useRouteGuard() {
  const { token, authInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth initialization (silent refresh) to complete before making routing decisions
    if (!authInitialized) {
      setIsLoading(true);
      return;
    }

    const isAuthenticated = !!token;
    console.log("[auth] route guard check:", { isAuthenticated, location, authInitialized });
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
  }, [token, location, navigate, authInitialized]);

  return { isLoading, isAuthenticated: !!token };
}

/**
 * Component wrapper to protect routes with authentication guard.
 * Usage: Wrap your protected pages with <ProtectedRoute><YourPage /></ProtectedRoute>
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading } = useRouteGuard();

  // While checking auth and potentially redirecting, show nothing
  // This prevents flashing the page content before redirect
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Hook to guard routes based on role.
 * Redirects users with unauthorized roles to a forbidden page.
 *
 * @param allowedRoles - Array of role names allowed to access the page
 * @param forbiddenPath - Path to redirect unauthorized users (default: /forbidden)
 * @returns { isLoading, hasAccess } for conditional rendering
 *
 * Usage:
 *   const { isLoading, hasAccess } = useRoleGuard(["admin", "manager"]);
 */
export function useRoleGuard(allowedRoles: string[], forbiddenPath: string = "/forbidden") {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No token means user is not authenticated; let useRouteGuard handle redirect to login
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Check if user's role is in the allowed roles
    const userRole = user?.role?.name;
    const isAllowed = userRole && allowedRoles.includes(userRole);

    if (!isAllowed) {
      // Redirect to forbidden page
      navigate(forbiddenPath);
      return;
    }

    // User has access, clear loading state
    setIsLoading(false);
  }, [token, user, allowedRoles, forbiddenPath, navigate]);

  return { isLoading, hasAccess: !!token && allowedRoles.includes(user?.role?.name || "") };
}

/**
 * Component wrapper to protect routes with role-based access control.
 * Automatically combines authentication check + role check.
 * Redirects unauthorized roles to forbidden page.
 *
 * @param allowedRoles - Array of role names allowed to access the page
 * @param forbiddenPath - Path to redirect unauthorized users (default: /forbidden)
 *
 * Usage:
 *   <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
 *     <AdminPanel />
 *   </RoleProtectedRoute>
 */
export function RoleProtectedRoute({
  children,
  allowedRoles,
  forbiddenPath = "/forbidden",
}: {
  children: ReactNode;
  allowedRoles: string[];
  forbiddenPath?: string;
}) {
  const { isLoading: authLoading } = useRouteGuard(); // Ensure user is logged in
  const { isLoading: roleLoading } = useRoleGuard(allowedRoles, forbiddenPath); // Ensure user has role

  // While checking auth and role, show nothing
  if (authLoading || roleLoading) {
    return null;
  }

  return <>{children}</>;
}

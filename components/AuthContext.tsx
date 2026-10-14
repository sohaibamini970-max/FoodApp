"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar_url?: string | null;
};

type AuthResult = {
  ok: boolean;
  error?: string;
  role?: "admin" | "user";
  pendingVerification?: boolean;
  email?: string;
};

type ForgotResult = {
  ok: boolean;
  error?: string;
};

type VerifyResetResult = {
  ok: boolean;
  error?: string;
  reset_token?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  verifyCode: (email: string, code: string) => Promise<AuthResult>;
  resendCode: (email: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  authFetch: (path: string, opts?: RequestInit) => Promise<Response>;

  /* ── Forgot password flow ── */
  requestPasswordReset: (email: string) => Promise<ForgotResult>;
  verifyResetCode: (
    email: string,
    code: string
  ) => Promise<VerifyResetResult>;
  resetPassword: (
    reset_token: string,
    password: string
  ) => Promise<ForgotResult>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_KEY = "foodiehub-access";
const REFRESH_KEY = "foodiehub-refresh";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- token helpers ---------- */
  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  /* ---------- authenticated fetch with auto refresh ---------- */
  const authFetch = useCallback(
    async (path: string, opts: RequestInit = {}) => {
      const isFormData =
        typeof FormData !== "undefined" && opts.body instanceof FormData;

      const makeReq = (token: string | null) =>
        fetch(`${API}${path}`, {
          ...opts,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(opts.headers || {}),
          },
        });

      let token = localStorage.getItem(ACCESS_KEY);
      let res = await makeReq(token);

      // access token expired → try refresh
      if (res.status === 401) {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (refreshToken) {
          const refreshRes = await fetch(`${API}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            saveTokens(data.accessToken, data.refreshToken);
            token = data.accessToken;
            res = await makeReq(token);
          } else {
            clearTokens();
            setUser(null);
          }
        }
      }
      return res;
    },
    []
  );

  /* ---------- session hydration on mount ---------- */
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(ACCESS_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  /* ---------- login ---------- */
  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok)
        return { ok: false, error: data.message || "Login failed" };

      saveTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  };

  /* ---------- register ---------- */
  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return { ok: false, error: json.message };

      // DO NOT log in yet — wait for verification
      return {
        ok: true,
        pendingVerification: true,
        email: json.email,
      };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ---------- verifyCode (signup OTP) ---------- */
  const verifyCode = async (
    email: string,
    code: string
  ): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.message };

      saveTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ---------- resendCode (signup OTP) ---------- */
  const resendCode = async (
    email: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { ok: res.ok, error: res.ok ? undefined : data.message };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ═══════════════ FORGOT PASSWORD FLOW ═══════════════ */

  /* ---------- 1. request reset code ---------- */
  const requestPasswordReset = async (email: string): Promise<ForgotResult> => {
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      return {
        ok: res.ok,
        error: res.ok ? undefined : data.message || "Could not send reset code",
      };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ---------- 2. verify code → get reset token ---------- */
  const verifyResetCode = async (
    email: string,
    code: string
  ): Promise<VerifyResetResult> => {
    try {
      const res = await fetch(`${API}/api/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.message };
      return { ok: true, reset_token: data.reset_token };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ---------- 3. set new password ---------- */
  const resetPassword = async (
    reset_token: string,
    password: string
  ): Promise<ForgotResult> => {
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token, password }),
      });
      const data = await res.json();
      return {
        ok: res.ok,
        error: res.ok ? undefined : data.message || "Reset failed",
      };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  /* ---------- logout ---------- */
  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      /* ignore */
    }
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyCode,
        resendCode,
        logout,
        authFetch,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
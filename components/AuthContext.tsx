"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  joinedAt: string;
};

type AuthContextType = {
  user: Omit<User, "password"> | null;
  users: User[];
  login: (username: string, password: string) => { ok: boolean; error?: string; role?: "admin" | "user" };
  register: (data: { name: string; email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  addUser: (u: Omit<User, "id" | "joinedAt">) => void;
  removeUser: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_KEY = "foodiehub-users";
const SESSION_KEY = "foodiehub-session";

// Seed users — admin/admin is always available
const SEED_USERS: User[] = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin",
    password: "admin",
    role: "admin",
    joinedAt: new Date().toISOString(),
  },
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    role: "user",
    joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "user-2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    password: "password",
    role: "user",
    joinedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_KEY);
      const storedSession = localStorage.getItem(SESSION_KEY);

      if (storedUsers) {
        const parsed: User[] = JSON.parse(storedUsers);
        // Ensure admin always exists
        const hasAdmin = parsed.some((u) => u.email === "admin");
        setUsers(hasAdmin ? parsed : [...SEED_USERS, ...parsed]);
      } else {
        setUsers(SEED_USERS);
      }

      if (storedSession) setUser(JSON.parse(storedSession));
    } catch {
      setUsers(SEED_USERS);
    }
    setHydrated(true);
  }, []);

  // Persist users
  useEffect(() => {
    if (hydrated) localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, hydrated]);

  // Persist session
  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user, hydrated]);

  const login = (username: string, password: string) => {
    const found = users.find(
      (u) =>
        (u.email === username || u.name === username) && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid credentials" };
    const { password: _p, ...safe } = found;
    setUser(safe);
    return { ok: true, role: found.role };
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    if (users.some((u) => u.email === data.email)) {
      return { ok: false, error: "Email already registered" };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: "user",
      joinedAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    const { password: _p, ...safe } = newUser;
    setUser(safe);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const addUser = (u: Omit<User, "id" | "joinedAt">) => {
    setUsers((prev) => [
      ...prev,
      { ...u, id: `user-${Date.now()}`, joinedAt: new Date().toISOString() },
    ]);
  };

  const removeUser = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <AuthContext.Provider
      value={{ user, users, login, register, logout, addUser, removeUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      users: [],
      login: () => ({ ok: false, error: "AuthProvider missing" }),
      register: () => ({ ok: false, error: "AuthProvider missing" }),
      logout: () => {},
      addUser: () => {},
      removeUser: () => {},
    } as AuthContextType;
  }
  return ctx;
}
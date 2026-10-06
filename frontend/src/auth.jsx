import { createContext, useContext, useMemo, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("campus-user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("campus-token", data.token);
    localStorage.setItem("campus-user", JSON.stringify(data));
    setUser(data);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("campus-token", data.token);
    localStorage.setItem("campus-user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("campus-token");
    localStorage.removeItem("campus-user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

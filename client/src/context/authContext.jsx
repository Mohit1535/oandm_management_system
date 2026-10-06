import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);


  // ================= SESSION =================

  const refreshSession = async () => {

    try {

      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setUser(null);
        setToken(null);
        return;
      }

      const { data } = await api.get(
        "/auth/session"
      );

      setUser(data.user);

    } catch (error) {

      console.log(
        "SESSION ERROR:",
        error.response?.data || error.message
      );

      localStorage.removeItem("token");

      setToken(null);
      setUser(null);

    } finally {

      setLoading(false);

    }
  };


  // ================= INITIAL LOAD =================

  useEffect(() => {
    refreshSession();
  }, []);


  // ================= LOGIN =================

  const login = async (
    userName,
    password,
    role
  ) => {

    const { data } = await api.post(
      "/auth/login",
      {
        userName,
        password,
        role,
      }
    );

    localStorage.setItem(
      "token",
      data.token
    );

    setToken(data.token);

    setUser(data.user);

    return data.user;
  };


  // ================= LOGOUT =================

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ================= HOOK =================

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
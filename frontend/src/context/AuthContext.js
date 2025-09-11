import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
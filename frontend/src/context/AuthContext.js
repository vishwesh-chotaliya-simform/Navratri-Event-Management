import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isUser, setIsUser] = useState(!!localStorage.getItem("userToken"));
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setIsUser(!!localStorage.getItem("userToken"));
      setIsAdmin(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (token, type = "user") => {
    if (type === "admin") {
      localStorage.setItem("token", token);
      setIsAdmin(true);
    } else {
      localStorage.setItem("userToken", token);
      setIsUser(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setIsUser(false);
    localStorage.removeItem("token");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isUser, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session against backend on mount
  useEffect(() => {
    async function loadCurrentUser() {
      const token = localStorage.getItem("zuri_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest("/auth/me", "GET");
        if (data && data.success && data.user) {
          setUser(data.user);
        } else {
          // Invalid response — clear stale token silently
          localStorage.removeItem("zuri_token");
        }
      } catch (err) {
        // Token is invalid or user was deleted — clear silently, no error log
        localStorage.removeItem("zuri_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      if (data && data.success && data.token) {
        localStorage.setItem("zuri_token", data.token);
        setUser(data.user);
        return data.user;
      }
      throw new Error("Invalid response format.");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, company, email, phone, password) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", "POST", {
        name,
        company,
        email,
        phone,
        password,
      });
      if (data && data.success && data.token) {
        localStorage.setItem("zuri_token", data.token);
        setUser(data.user);
        return data.user;
      }
      throw new Error("Invalid response format.");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("zuri_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

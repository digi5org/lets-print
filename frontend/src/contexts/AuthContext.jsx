"use client";

import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const login = async (email, password) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/login", redirect: true });
  };

  const updateUser = (userData) => {
    console.log("User update:", userData);
  };

  const value = {
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session,
    login,
    logout,
    updateUser,
    session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useEffect, useState, useContext } from "react";
import AuthData from "../types/authData";
import { decode } from "jsonwebtoken";

export type AuthContextType = {
  token: String | undefined;
  data: AuthData | undefined;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String | undefined>();
  const [data, setData] = useState<AuthData | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const initializeToken = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const token = localStorage.getItem("accessToken");
    if (token == null) return;
    setToken(token);
    const result = decode(token, { json: true });
    if (result == null) return;
    setData({
      id: result["sub"] as string,
      name: result["name"] as string,
      email: result["email"] as string,
      expirationDate: new Date((result["exp"] as number) * 1000),
    });
    setLoading(false);
  };

  useEffect(() => {
    initializeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        data,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};

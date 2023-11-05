"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import AuthData from "../types/authData";
import { decode } from "jsonwebtoken";

export type AuthContextType = {
  token: String | undefined;
  didFail: boolean;
  failAuth: () => void;
  data: AuthData | undefined;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String | undefined>();
  const [didFail, setDidFail] = useState<boolean>(false);
  const [data, setData] = useState<AuthData | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const initializeToken = async () => {
    const token = localStorage.getItem("accessToken");
    if (token == null) {
      setDidFail(true);
      setLoading(false);
      return;
    }
    setToken(token);
    const result = decode(token, { json: true });
    if (result == null || result["role"] !== "Admin") {
      setDidFail(true);
      setLoading(false);
      return;
    }
    setData({
      id: result["sub"] as string,
      name: result["name"] as string,
      email: result["email"] as string,
      expirationDate: new Date((result["exp"] as number) * 1000),
    });
    setLoading(false);
  };

  const failAuth = useCallback(() => setDidFail(true), []);

  useEffect(() => {
    initializeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        didFail,
        failAuth,
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

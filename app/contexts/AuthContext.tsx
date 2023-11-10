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
import { useFail } from "./FailContext";

export type AuthContextType = {
  token: String | undefined;
  data: AuthData | undefined;
  reload: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

enum DecodeError {
  Invalid,
  Permission,
  Expired,
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String | undefined>();
  const [data, setData] = useState<AuthData | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const failer = useFail();

  const failAuth = useCallback(() => {
    failer.failAuth();
    setIsLoading(false);
    localStorage.removeItem("accessToken");
  }, [failer]);

  const decodeToken = useCallback((token: string) => {
    const result = decode(token, { json: true });
    if (!result) return DecodeError.Invalid;

    const role = result["role"];
    if (
      !role ||
      (role instanceof Array && !role.includes("Admin")) ||
      (!(role instanceof Array) && role !== "Admin")
    )
      return DecodeError.Permission;

    if (!result.exp || result.exp < Date.now() / 1000)
      return DecodeError.Expired;

    return {
      id: result["sub"] as string,
      name: result["name"] as string,
      email: result["email"] as string,
      expirationDate: new Date((result["exp"] as number) * 1000),
    } as AuthData;
  }, []);

  const initializeToken = useCallback(async (refetchToken = false) => {
    const token = localStorage.getItem("accessToken");

    if (refetchToken || token === null) {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/pc`,
        {
          credentials: "include",
        },
      );

      if (result.status === 401) return failAuth();
      else if (!result.ok) return failAuth();

      const body = await result.text();
      const authData = decodeToken(body);

      if (
        authData === DecodeError.Invalid ||
        authData === DecodeError.Permission
      )
        return failAuth();
      else if (authData === DecodeError.Expired) {
        localStorage.removeItem("accessToken");
        await initializeToken(true);
        return;
      }

      setData(authData);
      localStorage.setItem("accessToken", body);
      setToken(body);
      setIsLoading(false);
      return;
    }

    const authData = decodeToken(token);

    if (authData === DecodeError.Invalid || authData === DecodeError.Permission)
      return failAuth();
    else if (authData === DecodeError.Expired) {
      localStorage.removeItem("accessToken");
      await initializeToken(true);
      return;
    }

    setData(authData);
    setToken(token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        data,
        isLoading,
        reload: initializeToken,
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

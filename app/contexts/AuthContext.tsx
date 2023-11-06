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
  retry: () => void;
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

  const failAuth = useCallback(() => {
    setDidFail(true);
    setLoading(false);
    localStorage.removeItem("accessToken");
  }, []);

  const decodeToken = useCallback((token: string) => {
    const result = decode(token, { json: true });
    if (!result) return;

    const role = result["role"];
    if (
      !role ||
      (role instanceof Array && !role.includes("Admin")) ||
      (!(role instanceof Array) && role !== "Admin")
    )
      return;

    if (!result.exp || result.exp < Date.now() / 1000) return;

    return {
      id: result["sub"] as string,
      name: result["name"] as string,
      email: result["email"] as string,
      expirationDate: new Date((result["exp"] as number) * 1000),
    } as AuthData;
  }, []);

  const initializeToken = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (token === null) {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/pc`);
      if (!result.ok) {
        console.log("Response Error: ", result.status);
        return failAuth();
      }
      const body = await result.text();
      const authData = decodeToken(body);

      if (authData) setData(authData);
      else return failAuth();

      localStorage.setItem("accessToken", body);
      setToken(body);

      setLoading(false);
      return;
    }

    const authData = decodeToken(token);
    if (authData) setData(authData);
    else return failAuth();

    setToken(token);
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeToken();
  }, []);

  if (didFail && !loading)
    return (
      <div className="mx-auto flex min-h-screen w-full select-none items-center justify-center md:w-2/4 xl:w-2/5 2xl:w-2/6">
        <div className="text-center text-onBackground dark:text-dark-onBackground">
          <h1 className="mb-3">Authentifizieren fehlgeschlagen.</h1>
          <p>
            Nur{" "}
            <b className="text-primary dark:text-dark-primary">
              Administratoren haben Zugriff
            </b>{" "}
            auf dieses Dashboard. Wenn du denkst, dass du Zugriff haben
            solltest, versuche es später erneut!
          </p>
        </div>
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        token,
        didFail,
        failAuth,
        data,
        retry: initializeToken,
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

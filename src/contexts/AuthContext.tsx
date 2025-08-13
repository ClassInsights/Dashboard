import ProgressSVG from "@/assets/svg/progress.svg?react";
import Prefetcher from "@/components/Prefetcher";
import { isAccessTokenResponse, isCustomJWTPayload } from "@/types/AccessToken";
import { isAuthData, type AuthData } from "@/types/AuthData";
import { isTokenExchangeData } from "@/types/TokenExchangeData";
import { useQuery } from "@tanstack/react-query";
import { decodeJwt } from "jose";
import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";

/** Redirects the user to the login page */
const redirectToLogin = () =>
  window.location.replace(
    `${import.meta.env.DEV ? "http://localhost:5173" : "https://classinsights.at"}/schulen`,
  );

type AuthContextType = AuthData & {
  /** Log the user out and redirect to the login page */
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const [authData, setAuthData] = useState<AuthData | undefined>(undefined);
  const loginToken = searchParams.get("token");

  useEffect(() => {
    if (loginToken) return;
    const cookie = getCookie("tasty-dashboard");
    if (!cookie) {
      redirectToLogin();
      return;
    }

    try {
      const parsed: unknown = JSON.parse(atob(cookie));

      if (!isAuthData(parsed)) throw new Error("Invalid auth data");
      if (parsed.expires < Date.now()) throw new Error("Auth data expired");

      setAuthData(parsed);
    } catch {
      removeCookie("tasty-dashboard");
      redirectToLogin();
    }
  }, [loginToken]);

  const tokenExchangeQuery = useQuery({
    queryKey: ["tokenExchange"],
    queryFn: async () => {
      const response = await fetch(
        `https://classinsights.${import.meta.env.DEV ? "dev" : "at"}/api/school/dashboard`,
        {
          method: "POST",
          body: JSON.stringify({ dashboard_token: loginToken }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (!isTokenExchangeData(data)) throw new Error("Invalid token exchange data");
      return data;
    },
    enabled: !!loginToken && !authData,
  });

  const accessTokenQuery = useQuery({
    queryKey: ["accessToken", tokenExchangeQuery.data],
    queryFn: async () => {
      if (!tokenExchangeQuery.data) throw new Error("Token exchange data is not available");

      const now = Date.now();

      const response = await fetch(`${tokenExchangeQuery.data.local_api_url}/user`, {
        method: "POST",
        body: JSON.stringify({ dashboard_token: loginToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (!isAccessTokenResponse(data)) throw new Error("Invalid access token response");
      const decodedData = decodeJwt(data.access_token);

      if (!isCustomJWTPayload(decodedData)) throw new Error("Invalid JWT payload");
      const expires = new Date((decodedData.exp ?? Date.now() / 1000) * 1000);

      const authData: AuthData = {
        name: decodedData.name,
        email: decodedData.email,
        roles: decodedData.role,
        accessToken: data.access_token,
        school: {
          id: tokenExchangeQuery.data.school_id,
          name: decodedData.school_name,
          apiUrl: tokenExchangeQuery.data.local_api_url,
          dashboardUrl: tokenExchangeQuery.data.local_dashboard_url,
          website: tokenExchangeQuery.data.website,
        },
        expires: expires.getTime(),
      };

      setCookie("tasty-dashboard", btoa(JSON.stringify(authData)), {
        expires,
        sameSite: "Strict",
        secure: import.meta.env.PROD,
      });

      setAuthData(authData);
      window.history.replaceState({}, "", window.location.pathname);

      const diff = Date.now() - now;
      if (diff < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - diff));
      }

      return authData;
    },
    enabled: !!tokenExchangeQuery.data && !authData,
  });

  const logout = async () => {
    removeCookie("tasty-dashboard");
    try {
      await fetch(`${authData?.school.apiUrl}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData?.accessToken}`,
        },
      });
    } catch {}

    window.location.replace(
      `${import.meta.env.DEV ? "http://localhost:5173" : "https://classinsights.at"}/schulen?logout=true`,
    );
  };

  if (tokenExchangeQuery.isError || accessTokenQuery.isError) {
    // TODO: create error screen
    return <h1>AUTH Failed</h1>;
  }

  if (tokenExchangeQuery.isLoading || accessTokenQuery.isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12">
        <img src="/logo.svg" alt="ClassInsights Logo" width={100} className="animate-pulse" />
        <div className="flex flex-col items-center pb-20 text-center">
          <h1 className="pb-6">Anmeldung läuft...</h1>
          <p>Sie werden gerade authentifiziert. Fast fertig!</p>
          <ProgressSVG width={50} className="mt-5 h-20 w-20 shrink-0 animate-spin fill-primary" />
        </div>
      </div>
    );
  }

  if (!authData) return null;

  return (
    <AuthContext.Provider
      value={{
        ...authData,
        logout,
      }}
    >
      <Prefetcher>{children}</Prefetcher>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

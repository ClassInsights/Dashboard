import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isTokenExchange, type TokenExchange } from "../types/TokenExchange";
import { isAccessTokenResponse, isCustomJWTPayload } from "../types/AccessToken";
import { isAuthData, type AuthData } from "../types/AuthData";
import * as jose from "jose";
import { Cookies } from "typescript-cookie";
import { useSearchParams } from "react-router-dom";

type AuthContextType = {
	isLoading: boolean;
	data?: AuthData;
	logout: () => void;
};

const AuthContext = createContext<undefined | AuthContextType>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [data, setData] = useState<AuthData | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	const tokenRef = useRef<string | undefined>(undefined);

	const [_, setSearchParams] = useSearchParams();

	const logout = useCallback(async () => {
		Cookies.remove("tasty-dashboard");
		try {
			await fetch(`${data?.school.apiUrl}/user`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${data?.accessToken}`,
				},
			});
		} catch {}
		window.location.replace(
			`${import.meta.env.DEV ? "http://localhost:5173" : "https://classinsights.at"}/schulen?logout=true`,
		);
	}, [data]);

	const requestAuthData = useCallback(
		async (exchangeData: TokenExchange, token: string) => {
			const response = await fetch(`${exchangeData.local_api_url}/user`, {
				method: "POST",
				body: JSON.stringify({ dashboard_token: token }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) throw new Error("Failed to fetch user data");
			const data = await response.json();
			if (!isAccessTokenResponse(data)) throw new Error(`Not a valid AccessTokenResponse, ${JSON.stringify(data)}`);

			const decodedData = jose.decodeJwt(data.access_token);
			if (!isCustomJWTPayload(decodedData))
				throw new Error(`Not a valid CustomJWTPayload, ${JSON.stringify(decodedData)}`);

			window.history.replaceState({}, "", window.location.pathname);
			setSearchParams({});

			const expirationDate = new Date((decodedData.exp ?? new Date().getTime() / 1000) * 1000);

			const authData: AuthData = {
				name: decodedData.name,
				email: decodedData.email,
				roles: decodedData.role,
				accessToken: data.access_token,
				school: {
					id: exchangeData.school_id,
					name: decodedData.school_name,
					apiUrl: exchangeData.local_api_url,
					dashboardUrl: exchangeData.local_dashboard_url,
					website: exchangeData.website,
				},
				expires: expirationDate.getTime(),
			};

			Cookies.set("tasty-dashboard", btoa(JSON.stringify(authData)), {
				expires: expirationDate,
				sameSite: "Lax",
				secure: import.meta.env.PROD,
			});

			return authData;
		},
		[setSearchParams],
	);

	const handleToken = useCallback(
		async (token: string) => {
			const response = await fetch(
				`https://classinsights${import.meta.env.DEV ? ".dev" : ".at"}/api/school/dashboard`,
				{
					method: "POST",
					body: JSON.stringify({ dashboard_token: token }),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			if (!response.ok) throw new Error("Failed to fetch token exchange data");

			const responseData = await response.json();
			if (!isTokenExchange(responseData)) throw new Error(`Not a valid TokenExchange, ${JSON.stringify(responseData)}`);

			requestAuthData(responseData, token)
				.then((data) => setData((oldData) => oldData ?? data))
				.catch((error) => console.error("Auth failed inside requestAuthData catch:", error))
				.finally(() => setIsLoading(false));
		},
		[requestAuthData],
	);

	const redirectToLogin = useCallback(() => {
		window.location.replace(
			`${import.meta.env.DEV ? "http://localhost:5173" : "https://classinsights.at"}/schulen?auto-redirect=true`,
		);
	}, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (tokenRef.current) return;

		const token = urlParams.get("token");
		if (!token) {
			const data = Cookies.get("tasty-dashboard");
			if (!data || typeof data !== "string") {
				redirectToLogin();
				return;
			}

			const decodedData = atob(data);
			const parsedData = JSON.parse(decodedData);
			if (!isAuthData(parsedData)) {
				Cookies.remove("tasty-dashboard");
				setIsLoading(false);
				return;
			}

			if (parsedData.expires < new Date().getTime()) {
				Cookies.remove("tasty-dashboard");
				redirectToLogin();
				return;
			}

			setData((oldAuthData) => oldAuthData ?? parsedData);
			setIsLoading(false);
			return;
		}

		handleToken(token).catch((error) => console.error("Auth failed inside handleToken catch:", error));

		return () => {
			if (!tokenRef.current) tokenRef.current = token;
		};
	}, [handleToken, redirectToLogin]);

	return <AuthContext.Provider value={{ isLoading, data, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

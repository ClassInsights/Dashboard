import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { Role } from "../types/AccessToken";

export type UpdateContextType = {
	isUnix: boolean;
	updateAvailable: boolean;
	isChecking: boolean;
	changes: ReactNode[];
	callUpdate: () => Promise<void>;
	abort: () => void;
};

type LocalApiResponse = {
	version: string;
	platform: string;
};

const isLocalApiResponse = (data: unknown): data is LocalApiResponse =>
	data !== null &&
	typeof data === "object" &&
	"version" in data &&
	typeof data.version === "string" &&
	"platform" in data &&
	typeof data.platform === "string";

export const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider = ({ children }: { children: React.ReactNode }) => {
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [isUnix, setIsUnix] = useState(false);
	const [changes, setChanges] = useState<ReactNode[]>([]);

	const alreadyChecked = useRef(false);

	const auth = useAuth();
	const toast = useToast();

	useEffect(() => {
		if (!auth.data || alreadyChecked.current) return;
		if (!auth.data.roles.includes(Role.ADMIN) && !auth.data.roles.includes(Role.OWNER)) return;

		alreadyChecked.current = true;
		checkApiUpdate().catch((error) => console.error("Error checking for API update", error));
		checkDashboardUpdate().catch((error) => console.error("Error checking for Dashboard update", error));
	});

	const callUpdate = useCallback(async () => {
		if (!updateAvailable || !auth.data) return;
		setUpdateAvailable(false);

		try {
			const response = await fetch(`${auth.data?.school.apiUrl}/update`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth.data?.accessToken}`,
				},
			});

			if (!response.ok) throw new Error("Update request failed");
			toast.showMessage("Update erfolgreich gestartet");
		} catch {
			toast.showMessage("Fehler beim Starten des Updates");
		}
	}, [updateAvailable, toast.showMessage, auth.data]);

	const checkApiUpdate = async () => {
		const response = await fetch("https://api.github.com/repos/classinsights/api/releases/latest");
		if (!response.ok) throw new Error("GitHub API request for Api repository failed");

		const data = await response.json();
		if (!data || !("tag_name" in data)) throw new Error("Invalid response from GitHub API");

		const latestTag = data.tag_name.replace("v", "");

		const url = auth.data?.school.apiUrl;
		if (!url) throw new Error("API URL is not available");

		const localResponse = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!localResponse.ok) throw new Error("Local API request failed");
		const localData = await localResponse.json();
		if (!isLocalApiResponse(localData)) throw new Error("Invalid response from local API");
		const localVersion = localData.version.replace("v", "");

		if (latestTag.toLowerCase() !== localVersion.toLowerCase()) {
			setChanges((prev) => [
				...prev,
				<p key="Api Change">
					API: {localVersion} &#8594; {latestTag}
					<span>
						{" "}
						(
						<a
							href={`https://github.com/ClassInsights/Api/compare/${localData.version}...${data.tag_name}`}
							target="_blank"
							rel="noreferrer"
							className="text-primary"
						>
							Änderungen
						</a>
						)
					</span>
				</p>,
			]);
			setUpdateAvailable(true);
		}

		setIsUnix(localData.platform.toLowerCase() === "unix");
	};

	const checkDashboardUpdate = async () => {
		const response = await fetch("https://api.github.com/repos/classinsights/dashboard/releases/latest");
		if (!response.ok) throw new Error("GitHub API request for Dashboard repository failed");
		const data = await response.json();

		if (!data || !("tag_name" in data)) throw new Error("Invalid response from GitHub API");
		const latestTag = data.tag_name.replace("v", "");

		const localVersion = import.meta.env.PACKAGE_VERSION;

		if (latestTag.toLowerCase() !== localVersion.toLowerCase()) {
			setChanges((prev) => [
				...prev,
				<p key="Dashboard Change">
					Dashboard: {localVersion} &#8594; {latestTag}
					<span>
						{" "}
						(
						<a
							href={`https://github.com/ClassInsights/Dashboard/compare/v${localVersion}...${data.tag_name}`}
							target="_blank"
							rel="noreferrer"
							className="text-primary"
						>
							Änderungen
						</a>
						)
					</span>
				</p>,
			]);
			setUpdateAvailable(true);
		}
	};

	const abort = useCallback(() => setUpdateAvailable(false), []);

	return (
		<UpdateContext.Provider
			value={{
				isUnix,
				updateAvailable,
				isChecking: alreadyChecked.current,
				changes,
				callUpdate,
				abort,
			}}
		>
			{children}
		</UpdateContext.Provider>
	);
};

export const useUpdate = () => {
	const contest = useContext(UpdateContext);
	if (!contest) throw new Error("useUpdate must be used within a UpdateProvider");
	return contest;
};

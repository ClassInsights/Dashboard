import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSettings, type Settings } from "../types/Settings";
import { useAuth } from "./AuthContext";
import { Role } from "../types/AccessToken";
import { useToast } from "./ToastContext";

type SettingsContextType = {
	getSettings: () => Settings | undefined;
	updateSettings: (key: string, value: number | boolean) => void;
	hasUnsavedChanges: boolean;
	saveSettings: () => Promise<void>;
	isLoading: boolean;
	refreshSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const [settings, setSettings] = useState<Settings | undefined>(undefined);
	const [newSettings, setNewSettings] = useState<Settings | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	const auth = useAuth();
	const toast = useToast();

	const getSettings = () => newSettings ?? settings;

	const updateSettings = useCallback(
		(key: string, value: number | boolean) => {
			if (!settings && !newSettings) return;
			if (newSettings) setNewSettings({ ...newSettings, [key]: value });
			else if (settings) setNewSettings({ ...settings, [key]: value });
		},
		[settings, newSettings],
	);

	const hasUnsavedChanges = useMemo(() => {
		if (!settings || !newSettings) return false;
		return JSON.stringify(settings) !== JSON.stringify(newSettings);
	}, [settings, newSettings]);

	const fetchSettings = useCallback(async () => {
		if (!auth.data) return;
		if (!auth.data.roles.includes(Role.ADMIN) && !auth.data.roles.includes(Role.OWNER))
			throw new Error("Unauthorized access");

		const response = await fetch(`${auth.data?.school.apiUrl}/settings/dashboard`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch settings");

		const data = await response.json();
		if (!data || !isSettings(data)) throw new Error("Invalid settings data");

		return data;
	}, [auth.data]);

	const saveSettings = useCallback(async () => {
		if (!newSettings) return;
		const response = await fetch(`${auth.data?.school.apiUrl}/settings/dashboard`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
			body: JSON.stringify(newSettings),
		});

		if (!response.ok) {
			setNewSettings(undefined);
			throw new Error("Failed to save settings");
		}

		setSettings(newSettings);
		setNewSettings(undefined);
	}, [auth.data, newSettings]);

	const refreshSettings = useCallback(() => {
		if (isRefreshing) return;
		setIsRefreshing(true);
		fetchSettings()
			.then((data) => {
				setSettings(data);
				toast.showMessage("Erfolgreich aktualisiert");
			})
			.catch((error) => {
				console.error("Error fetching settings:", error);
				toast.showMessage("Fehler beim Aktualisieren der Einstellungen", "error");
			})
			.finally(() => setIsRefreshing(false));
	}, [fetchSettings, isRefreshing, toast.showMessage]);

	useEffect(() => {
		fetchSettings()
			.then((data) => setSettings(data))
			.catch((error) => console.error("Error fetching settings:", error))
			.finally(() => setIsLoading(false));
	}, [fetchSettings]);

	return (
		<SettingsContext.Provider
			value={{ getSettings, updateSettings, hasUnsavedChanges, saveSettings, isLoading, refreshSettings }}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) throw new Error("useSettings must be used within a SettingsProvider");
	return context;
};

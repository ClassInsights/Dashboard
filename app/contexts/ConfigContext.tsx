"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import Config from "../types/config";

type ConfigContextType = {
  getConfig: () => Config | undefined;
  updateConfig: (updatedConfig: Config) => void;
  hasUnsavedChanges: boolean;
  saveConfig: () => Promise<boolean>;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [newConfig, setNewConfig] = useState<Config | undefined>(undefined);

  const hasUnsavedChanges = useMemo(() => {
    if (!config || !newConfig) return false;
    return !(
      config.teacherGroupId === newConfig.teacherGroupId &&
      config.domainSid === newConfig.domainSid &&
      config.caSubject === newConfig.caSubject &&
      config.azureGroupPattern === newConfig.azureGroupPattern
    );
  }, [config, newConfig]);

  const updateConfig = useCallback(
    (updatedConfig: Config) => setNewConfig(updatedConfig),
    [],
  );

  const getConfig = useCallback(() => newConfig ?? config, [newConfig, config]);

  const saveConfig = useCallback(async () => {
    // TODO: Save config to Server
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setConfig(newConfig);
    setNewConfig(undefined);
    return true;
  }, [newConfig]);

  useEffect(() => {
    // TODO: Fetch config from Server
    setConfig({
      teacherGroupId: "e4816e17-4c37-8306-6fe6-9f96d74c4b25",
      domainSid: "S-3-8-23-5892810687-2502163817-4270430042",
      domainName: "projekt.local",
      caSubject: "projekt-DC01PROJEKT-CA",
      schoolYear: {
        name: "2023/2024",
        startDate: new Date(2023, 9, 10),
        endDate: new Date(2024, 7, 6),
      },
      azureGroupPattern: "YEAR_CLASS",
    });
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        getConfig,
        updateConfig,
        hasUnsavedChanges,
        saveConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
};

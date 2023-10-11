"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Config from "../types/config";

type ConfigContextType = {
  config: Config | undefined;
  setConfig: (config: Config) => void;
  hasUnsavedChanges: boolean;
  saveConfig: () => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useRef<Config | undefined>(undefined);
  const newConfig = useRef<Config | undefined>(undefined);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const getConfig = useMemo(() => config.current, []);

  const setConfig = useCallback((updatedConfig: Config) => {
    newConfig.current = updatedConfig;
  }, []);

  const saveConfig = useCallback(() => {
    // TODO: Save config to Server
    config.current = newConfig.current;
    newConfig.current = undefined;
    setHasUnsavedChanges(false);
  }, []);

  useEffect(() => {});

  return (
    <ConfigContext.Provider
      value={{
        config: getConfig,
        setConfig,
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

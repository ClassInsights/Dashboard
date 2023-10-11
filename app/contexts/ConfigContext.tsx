"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Config from "../types/config";

type ConfigContextType = {
  config: Config | undefined;
  setConfig: (config: Config) => void;
  saveConfig: () => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useRef<Config | undefined>(undefined);

  const getConfig = useMemo(() => config.current, []);

  const setConfig = useCallback((config: Config) => {
    config = config;
  }, []);

  const saveConfig = useCallback(() => {
    // TODO: Save config to Server
  }, [config]);

  return (
    <ConfigContext.Provider
      value={{
        config: getConfig,
        setConfig,
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

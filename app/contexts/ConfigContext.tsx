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
import { useFail } from "./FailContext";
import { useAuth } from "./AuthContext";

type ConfigContextType = {
  getConfig: () => Config | undefined;
  updateConfig: (updatedConfig: Config) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isLoading: boolean;
  saveConfig: () => Promise<boolean>;
  fetchConfig: () => Promise<boolean>;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [newConfig, setNewConfig] = useState<Config | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const auth = useAuth();
  const failer = useFail();

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/config`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        },
      );
      if (!response.ok) {
        failer.fail(
          "Fehler beim Laden der Konfiguration",
          await response.text(),
        );
        setIsLoading(false);
        return false;
      }
      const config = await response.json();
      setConfig({
        teacherGroupId: config.TeacherGroup,
        domainSid: config.DomainSid,
        domainName: config.DomainName,
        caSubject: config.CASubject,
        schoolYear: {
          name: config.SchoolYear?.Name,
          startDate: new Date(config.SchoolYear?.StartDate),
          endDate: new Date(config.SchoolYear?.EndDate),
        },
        influx: {
          query: config.Influx?.Query,
          token: config.Influx?.Token,
          server: config.Influx?.Server,
          organisation: config.Influx?.Organisation,
        },
        azureGroupPattern: config.AzureGroupPattern,
      });
    } catch (error: any) {
      failer.fail("Fehler beim Laden der Konfiguration", error.toString());
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return true;
  }, [auth.token, failer]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const getConfig = useCallback(() => newConfig ?? config, [newConfig, config]);

  const updateConfig = useCallback(
    (updatedConfig: Config) => setNewConfig(updatedConfig),
    [],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!config || !newConfig) return false;
    return JSON.stringify(config) !== JSON.stringify(newConfig);
  }, [config, newConfig]);

  const saveConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      if (!newConfig) return false;
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TeacherGroup: newConfig.teacherGroupId,
          DomainSid: newConfig.domainSid,
          CASubject: newConfig.caSubject,
          SchoolYear: {
            Name: newConfig.schoolYear?.name,
            StartDate: newConfig.schoolYear?.startDate?.toISOString(),
            EndDate: newConfig.schoolYear?.endDate?.toISOString(),
          },
          Influx: {
            Query: newConfig.influx?.query,
            Token: newConfig.influx?.token,
            Server: newConfig.influx?.server,
            Organisation: newConfig.influx?.organisation,
          },
          AzureGroupPattern: newConfig.azureGroupPattern,
        }),
      });
      if (!result.ok) {
        setIsSaving(false);
        return false;
      }
      setConfig(newConfig);
      setNewConfig(undefined);
      setIsSaving(false);
      return true;
    } catch (error) {
      setIsSaving(false);
      return false;
    }
  }, [newConfig, auth.token]);

  return (
    <ConfigContext.Provider
      value={{
        getConfig,
        updateConfig,
        hasUnsavedChanges,
        isSaving,
        isLoading,
        saveConfig,
        fetchConfig,
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

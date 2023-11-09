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
import Loading from "../components/Loading";
import { useAuth } from "./AuthContext";

type ConfigContextType = {
  getConfig: () => Config | undefined;
  updateConfig: (updatedConfig: Config) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveConfig: () => Promise<boolean>;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [newConfig, setNewConfig] = useState<Config | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const auth = useAuth();
  const failer = useFail();

  const fetchConfig = useCallback(async () => {
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
        return;
      }
      const config = await response.json();
      setConfig({
        teacherGroupId: config.TeacherGroup,
        domainSid: config.DomainSid,
        domainName: config.DomainName,
        caSubject: config.CASubject,
        schoolYear: {
          name: config.SchoolYear.Name,
          startDate: new Date(config.SchoolYear.StartDate),
          endDate: new Date(config.SchoolYear.EndDate),
        },
        azureGroupPattern: config.AzureGroupPattern,
      });
    } catch (error: any) {
      failer.fail("Fehler beim Laden der Konfiguration", error.toString());
    }
  }, []);

  useEffect(() => {
    fetchConfig().then(() => setLoading(false));
  }, []);

  const getConfig = useCallback(() => newConfig ?? config, [newConfig, config]);

  const updateConfig = useCallback(
    (updatedConfig: Config) => setNewConfig(updatedConfig),
    [],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!config || !newConfig) return false;
    return !(
      config.teacherGroupId === newConfig.teacherGroupId &&
      config.domainSid === newConfig.domainSid &&
      config.caSubject === newConfig.caSubject &&
      config.azureGroupPattern === newConfig.azureGroupPattern
    );
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
            Name: newConfig.schoolYear.name,
            StartDate: newConfig.schoolYear.startDate.toISOString(),
            EndDate: newConfig.schoolYear.endDate.toISOString(),
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
  }, [newConfig]);

  if (loading) return <Loading />;

  return (
    <ConfigContext.Provider
      value={{
        getConfig,
        updateConfig,
        hasUnsavedChanges,
        isSaving,
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

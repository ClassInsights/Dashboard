"use client";

import { createContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { useLog } from "./LogContext";
import { useData } from "./DataContext";
import { useAuth } from "./AuthContext";
import Loading from "../components/Loading";

type LoadingContext = {
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContext | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const theme = useTheme();
  const auth = useAuth();
  const data = useData();
  const log = useLog();

  useEffect(() => {
    setIsLoading(
      theme.isLoading || auth.isLoading || data.isLoading || log.isLoading,
    );
  }, [theme, auth, data, log]);

  if (isLoading) return <Loading />;

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

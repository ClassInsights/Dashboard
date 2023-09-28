"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Computer from "../types/computer";
import Room from "../types/room";
import SchoolClass from "../types/schoolclass";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";

export type DataContextType = {
  rooms?: Room[];
  setRooms?: React.Dispatch<React.SetStateAction<Room[]>>;
  computers?: Computer[];
  setComputers?: React.Dispatch<React.SetStateAction<Computer[]>>;
  classes?: SchoolClass[];
  setClasses?: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
};

export const DataContext = createContext<DataContextType>({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [computers, setComputers] = useState<Computer[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const theme = useTheme();
  const auth = useAuth();

  const initializeData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    setParentLoading(theme.loading || auth.loading);
  }, [loading, theme.loading, auth.loading]);

  if (loading || parentLoading) return <h1>WE WAITNG</h1>;

  return (
    <DataContext.Provider
      value={{ rooms, setRooms, computers, setComputers, classes, setClasses }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataContextProvider");
  }
  return context;
};

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Room from "../types/room";
import SchoolClass from "../types/schoolclass";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";

export type DataContextType = {
  rooms?: Room[];
  classes?: SchoolClass[];
};

export const DataContext = createContext<DataContextType>({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const theme = useTheme();
  const auth = useAuth();

  const fetchRooms = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRooms([
      {
        id: 102,
        name: "OG2-DV3",
        longName: "Obergeschoss 2 - DV3",
        deviceCount: 30,
      },
      {
        id: 103,
        name: "OG3-DV6",
        longName: "Obergeschoss 2 - DV4",
        deviceCount: 26,
      },
    ]);

    // TODO: Fetch rooms from API
  };

  const initializeData = async () => {
    await fetchRooms();
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
    <DataContext.Provider value={{ rooms, classes }}>
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

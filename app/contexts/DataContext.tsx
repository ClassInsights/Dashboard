"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Room from "../types/room";
import SchoolClass from "../types/schoolclass";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import Computer from "../types/computer";

export type DataContextType = {
  rooms: Room[];
  computers: Computer[];
  setComputers: React.Dispatch<React.SetStateAction<Computer[]>>;
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [computers, setComputers] = useState<Computer[]>([
    {
      id: 1,
      roomId: 102,
      name: "PC1",
      ipAddress: "192.168.58.62",
      macAddress: "00:00:00:00:00:00",
      lastUser: "Max Mustermann",
    },
    {
      id: 2,
      roomId: 102,
      name: "PC2",
      ipAddress: "192.168.58.65",
    },
    {
      id: 3,
      roomId: 102,
      name: "PC3",
      lastUser: "Maria Musterfrau",
    },
    {
      id: 4,
      roomId: 102,
      name: "PC4",
      macAddress: "00:00:00:00:00:00",
    },
    {
      id: 5,
      roomId: 103,
      name: "PC5",
    },
  ]);

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
    <DataContext.Provider value={{ rooms, computers, setComputers }}>
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

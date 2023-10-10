"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Room from "../types/room";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import Computer from "../types/computer";
import Loading from "../components/Loading";

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
      online: true,
    },
    {
      id: 2,
      roomId: 102,
      name: "PC2",
      ipAddress: "192.168.58.65",
      online: false,
    },
    {
      id: 3,
      roomId: 102,
      name: "PC3",
      lastUser: "Maria Musterfrau",
      online: true,
    },
    {
      id: 4,
      roomId: 102,
      name: "PC4",
      macAddress: "00:00:00:00:00:00",
      online: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC5",
      online: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC6",
      online: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC7",
      online: true,
    },
    {
      id: 6,
      roomId: 103,
      name: "PC5",
      online: false,
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

    // TODO: Fetch rooms from API; auth.failAuth() on error while fetching
  };

  const initializeData = async () => {
    await fetchRooms();
    setLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    setParentLoading(theme.loading || auth.loading);
  }, [loading, theme.loading, auth.loading]);

  if (loading || parentLoading) return <Loading />;

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

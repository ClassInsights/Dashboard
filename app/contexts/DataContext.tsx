"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import Room from "../types/room";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import Computer from "../types/computer";
import Loading from "../components/Loading";

export type DataContextType = {
  rooms: Room[];
  reloadRooms: () => void;
  computers: Computer[];
  fetchComputers: (id: number) => Promise<void>;
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
      macAddress: "001122334455",
      lastUser: "Max Mustermann",
      isOnline: true,
    },
    {
      id: 2,
      roomId: 102,
      name: "PC2",
      ipAddress: "192.168.58.65",
      isOnline: false,
    },
    {
      id: 3,
      roomId: 102,
      name: "PC3",
      lastUser: "Maria Musterfrau",
      isOnline: true,
    },
    {
      id: 4,
      roomId: 102,
      name: "PC4",
      macAddress: "001122334455",
      isOnline: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC5",
      isOnline: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC6",
      isOnline: true,
    },
    {
      id: 5,
      roomId: 102,
      name: "PC7",
      isOnline: true,
    },
    {
      id: 6,
      roomId: 103,
      name: "PC5",
      isOnline: false,
    },
  ]);

  const theme = useTheme();
  const auth = useAuth();

  const fetchRooms = useCallback(async () => {
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
  }, []);

  const reloadRooms = useCallback(async () => {
    setLoading(true);
    await fetchRooms();
    setLoading(false);
  }, [fetchRooms]);

  const fetchComputers = useCallback(async () => {
    // TODO: Fetch computers from API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  const initializeData = useCallback(async () => {
    await fetchRooms();
    await fetchComputers();
    setLoading(false);
  }, [fetchRooms, fetchComputers]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    setParentLoading(theme.loading || auth.loading);
  }, [loading, theme.loading, auth.loading]);

  if (loading || parentLoading) return <Loading />;

  return (
    <DataContext.Provider
      value={{ rooms, reloadRooms, computers, fetchComputers }}
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

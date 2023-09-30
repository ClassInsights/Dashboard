"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Computer from "../types/computer";
import Room from "../types/room";
import SchoolClass from "../types/schoolclass";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";

export type DataContextType = {
  rooms?: Room[];
  computers?: Computer[];
  classes?: SchoolClass[];
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

  const fetchRooms = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/rooms", {
      headers: {
        Authorization: "Bearer " + auth.token,
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(response);
    setRooms(rooms);
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
    <DataContext.Provider value={{ rooms, computers, classes }}>
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

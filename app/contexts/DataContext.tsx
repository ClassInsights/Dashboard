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
import { useFail } from "./FailContext";

export type DataContextType = {
  rooms: Room[];
  fetchRooms: () => Promise<void>;
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
  const [computers, setComputers] = useState<Computer[]>([]);

  const theme = useTheme();
  const auth = useAuth();
  const failer = useFail();

  const fetchRooms = useCallback(async () => {
    if (failer.hasFailed || !auth.token) return;
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await result.json();
      const newRooms: Room[] = [];
      data.forEach((room: any) =>
        newRooms.push({
          id: room.roomId,
          name: room.name,
          longName: room.longName,
          deviceCount: room.deviceCount,
        }),
      );
      if (
        newRooms.length === rooms.length &&
        newRooms.every(
          (room, index, _) =>
            room.id === rooms[index].id &&
            room.name === rooms[index].name &&
            room.longName === rooms[index].longName &&
            room.deviceCount === rooms[index].deviceCount,
        )
      )
        return;
      setRooms(newRooms);
    } catch (error: any) {
      failer.fail("Fehler beim Laden der Räume", error.toString());
      return;
    }
  }, [auth, rooms, failer]);

  const fetchComputers = useCallback(
    async (roomId: number) => {
      if (failer.hasFailed || !auth.token) return;
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/computers`,
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          },
        );
        const data = await result.json();
        const newComputers: Computer[] = [];
        data.forEach((computer: any) =>
          computers.push({
            id: computer.computerId,
            roomId: computer.roomId,
            name: computer.name,
            isOnline: computer.online,
            macAddress: computer.macAddress,
            ipAddress: computer.ipAddress,
            lastUser: computer.lastUser,
          }),
        );
        const filteredComputers = computers.filter(
          (computer) => computer.roomId === roomId,
        );

        if (
          filteredComputers.length === newComputers.length &&
          newComputers.every(
            (computer, index, _) =>
              computer.id === filteredComputers[index].id &&
              computer.name === filteredComputers[index].name &&
              computer.isOnline === filteredComputers[index].isOnline &&
              computer.macAddress === filteredComputers[index].macAddress &&
              computer.ipAddress === filteredComputers[index].ipAddress &&
              computer.lastUser === filteredComputers[index].lastUser,
          )
        )
          return;
        setComputers(newComputers);
      } catch (error: any) {
        failer.fail("Fehler beim Laden der Räume", error.toString());
        return;
      }
    },
    [auth, computers, failer],
  );

  useEffect(() => {
    fetchRooms().then(() => setLoading(false));
  }, [fetchRooms]);

  useEffect(
    () => setParentLoading(theme.loading || auth.loading),
    [loading, theme.loading, auth.loading],
  );

  if (loading || parentLoading) return <Loading />;

  return (
    <DataContext.Provider
      value={{ rooms, fetchRooms, computers, fetchComputers }}
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

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
import { useRatelimit } from "./RatelimitContext";

export enum FetchError {
  Unknown,
  Ratelimited,
  Unauthorized,
}

export type DataContextType = {
  rooms: Room[];
  fetchRooms: (skipRatelimit?: boolean) => Promise<FetchError | undefined>;
  computers: Computer[];
  fetchComputers: (
    id: number,
    skipRatelimit?: boolean,
  ) => Promise<FetchError | undefined>;
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
  const ratelimit = useRatelimit();
  const failer = useFail();

  const fetchRooms = useCallback(
    async (skipRatelimit = false) => {
      if (failer.hasFailed || !auth.token) return FetchError.Unauthorized;
      if (!skipRatelimit && ratelimit.isRateLimited("fetchRooms"))
        return FetchError.Ratelimited;
      try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        });

        if (!skipRatelimit) ratelimit.addRateLimit("fetchRooms");

        if (result.status === 401) {
          failer.fail(
            "Fehler beim Aktualisieren der Computer",
            "Request finished with Code 401 (Unauthorized)",
          );
          return FetchError.Unauthorized;
        } else if (result.status === 429) return FetchError.Ratelimited;
        else if (result.status !== 200) return FetchError.Unknown;

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
    },
    [auth, rooms, failer, ratelimit],
  );

  useEffect(() => {
    if (!auth.token || auth.token === "") return;
    fetchRooms(true).then(() => setLoading(false));
  }, [auth]);

  const fetchComputers = useCallback(
    async (roomId: number, skipRatelimit = false) => {
      if (failer.hasFailed || !auth.token) return;
      if (!skipRatelimit && ratelimit.isRateLimited("fetchComputers"))
        return FetchError.Ratelimited;
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/computers`,
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (!skipRatelimit) ratelimit.addRateLimit("fetchComputers");

        if (result.status === 401) {
          failer.fail(
            "Fehler beim Aktualisieren der Computer",
            "Request finished with Code 401 (Unauthorized)",
          );
          return FetchError.Unauthorized;
        } else if (result.status === 429) return FetchError.Ratelimited;
        else if (result.status !== 200) return FetchError.Unknown;

        const data = await result.json();
        const newComputers: Computer[] = [];
        data.forEach((computer: any) =>
          newComputers.push({
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
        failer.fail("Fehler beim Laden der Computer", error.toString());
        return;
      }
    },
    [auth, computers, failer, ratelimit],
  );

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

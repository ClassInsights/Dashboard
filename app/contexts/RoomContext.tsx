"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FetchResponse, ResponseType } from "../types/response";
import { useRatelimit } from "./RatelimitContext";
import { useResponse } from "./ResponseContext";
import { useAuth } from "./AuthContext";
import Room from "../types/room";
import Loading from "../components/Loading";
import { useFail } from "./FailContext";

type RoomContextType = {
  rooms: Room[];
  fetchRooms: () => Promise<FetchResponse>;
  refreshRooms: () => Promise<void>;
  isLoading: boolean;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = useAuth();
  const ratelimit = useRatelimit();
  const response = useResponse();
  const failer = useFail();

  const fetchRooms = useCallback(async () => {
    if (ratelimit.isRateLimited("rooms")) {
      setIsLoading(false);
      return {
        type: ResponseType.ClientRatelimited,
        message: "rooms",
      };
    }

    var result: FetchResponse;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      });

      if (rooms) ratelimit.addRateLimit("rooms");

      result = response.buildResponse(
        res.status,
        "Räume wurden erfolgreich aktualisiert",
      );

      if (result.type !== ResponseType.Success) {
        setIsLoading(false);
        return result;
      }

      const json = await res.json();
      const newRooms: Room[] = json.map((room: any) => {
        return {
          id: room.roomId,
          name: room.name,
          longName: room.longName,
          deviceCount: room.deviceCount,
        } as Room;
      });

      const isEqual =
        newRooms.length === rooms?.length &&
        newRooms.every(
          (room, index) =>
            room.id === rooms[index].id &&
            room.name === rooms[index].name &&
            room.longName === rooms[index].longName &&
            room.deviceCount === rooms[index].deviceCount,
        );

      if (rooms && isEqual) {
        setIsLoading(false);
        return result;
      }

      setRooms(newRooms);
      setIsLoading(false);
      return result;
    } catch (e: any) {
      failer.fail(
        "Räume konnten nicht geladen werden. Wurde CORS korrekt konfiguriert?",
        e.toString(),
      );
      setIsLoading(false);
      return {
        type: ResponseType.Unknown,
      } as FetchResponse;
    }
  }, [auth.token, rooms, ratelimit, response]);

  const refreshRooms = useCallback(async () => {
    var hasFinished = false;
    const timeout = setTimeout(() => !hasFinished && setIsLoading(true), 500);
    const result = await fetchRooms();
    hasFinished = true;
    response.handleResponse(result);
    clearTimeout(timeout);
  }, [fetchRooms, response]);

  useEffect(() => {
    if (auth.token) fetchRooms();
  }, [auth.token]);

  if (isLoading) return <Loading />;

  return (
    <RoomContext.Provider
      value={{
        rooms: rooms ?? [],
        fetchRooms,
        refreshRooms,
        isLoading,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};

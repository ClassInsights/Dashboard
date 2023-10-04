"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Computer from "../types/computer";

export type RoomContextType = {
  roomId?: number;
  switchRoom: (roomId: number) => void;
  loading: boolean;
  computers?: Computer[];
};

export const RoomContext = createContext<RoomContextType | undefined>(
  undefined,
);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const roomId = useRef(0);
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComputers = useCallback(async () => {
    // TODO: Fetch computers from API
    // const response = await fetch();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  }, []);

  const setRoom = useCallback(async (id: number) => {
    setLoading(true);
    roomId.current = id;
    await fetchComputers();
  }, []);

  return (
    <RoomContext.Provider
      value={{
        roomId: roomId.current,
        loading,
        switchRoom: setRoom,
        computers,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};

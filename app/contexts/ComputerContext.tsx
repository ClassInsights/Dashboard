"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Computer from "../types/computer";
import { FetchResponse, ResponseType } from "../types/response";
import { useRatelimit } from "./RatelimitContext";
import { useResponse } from "./ResponseContext";
import { useAuth } from "./AuthContext";

type ComputerContextType = {
  computers: Computer[];
  fetchComputers: (roomId: number) => Promise<FetchResponse>;
  refreshComputers: (roomId: number) => Promise<void>;
  updateComputer: (computer: Computer) => void;
  clearComputers: () => void;
  isLoading: boolean;
};

const ComputerContext = createContext<ComputerContextType | undefined>(
  undefined,
);

export const ComputerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [computers, setComputers] = useState<Computer[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = useAuth();
  const ratelimit = useRatelimit();
  const response = useResponse();

  const fetchComputers = useCallback(
    async (roomId: number, isRefresh = false) => {
      if (!isRefresh) setIsLoading(true);

      if (ratelimit.isRateLimited(`computers-${roomId}`)) {
        setIsLoading(false);
        return {
          type: ResponseType.ClientRatelimited,
          message: `computers-${roomId}`,
        };
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/computers`,
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (
          computers &&
          computers.find((computer) => computer.roomId === roomId)
        )
          ratelimit.addRateLimit(`computers-${roomId}`);

        const result = response.buildResponse(
          res.status,
          "Computer wurden erfolgreich aktualisiert",
        );

        if (result.type !== ResponseType.Success) {
          setIsLoading(false);
          return result;
        }

        const json = await res.json();
        const newComputers: Computer[] = json.map((computer: any) => {
          return {
            id: computer.computerId,
            roomId: computer.roomId,
            name: computer.name,
            macAddress: computer.macAddress,
            ipAddress: computer.ipAddress,
            lastUser: computer.lastUser,
            lastSeen: new Date(computer.lastSeen),
            isOnline: computer.online,
          } as Computer;
        });

        const filteredComputers = (computers ?? []).filter(
          (computer: Computer) => computer.roomId === roomId,
        );

        const isEqual =
          newComputers.length === filteredComputers.length &&
          filteredComputers.every(
            (computer, index) =>
              computer.id === newComputers[index].id &&
              computer.roomId === newComputers[index].roomId &&
              computer.name === newComputers[index].name &&
              computer.macAddress === newComputers[index].macAddress &&
              computer.ipAddress === newComputers[index].ipAddress &&
              computer.lastUser === newComputers[index].lastUser &&
              computer.lastSeen?.getTime() ===
                newComputers[index].lastSeen?.getTime() &&
              computer.isOnline === newComputers[index].isOnline,
          );

        if (newComputers && isEqual) {
          setIsLoading(false);
          return result;
        }

        const otherComputers = (computers ?? []).filter(
          (computer) => computer.roomId !== roomId,
        );

        setComputers([...otherComputers, ...newComputers]);
        setIsLoading(false);
        return result;
      } catch (error) {
        setIsLoading(false);
        return {
          type: ResponseType.Unknown,
        } as FetchResponse;
      }
    },
    [ratelimit, auth.token, computers, response],
  );

  const refreshComputers = useCallback(
    async (roomId: number) => {
      var hasFinished = false;
      const timeout = setTimeout(() => !hasFinished && setIsLoading(true), 500);
      const result = await fetchComputers(roomId, true);
      hasFinished = true;
      response.handleResponse(result);
      clearTimeout(timeout);
    },
    [fetchComputers, response],
  );

  const updateComputer = useCallback((computer: Computer) => {
    setComputers(
      (computers) =>
        computers?.map((c) => (c.id === computer.id ? computer : c)),
    );
  }, []);

  const clearComputers = useCallback(() => setComputers([]), []);

  return (
    <ComputerContext.Provider
      value={{
        computers: computers ?? [],
        fetchComputers,
        refreshComputers,
        updateComputer,
        clearComputers,
        isLoading,
      }}
    >
      {children}
    </ComputerContext.Provider>
  );
};

export const useComputers = () => {
  const context = useContext(ComputerContext);
  if (context === undefined) {
    throw new Error("useComputer must be used within a ComputerProvider");
  }
  return context;
};

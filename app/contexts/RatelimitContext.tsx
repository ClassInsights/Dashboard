"use client";
import { createContext, useCallback, useState, useContext } from "react";
import Ratelimit from "../types/ratelimit";

type RatelimitContextType = {
  ratelimits: Ratelimit[];
  isRateLimited(key: string): boolean;
  addRateLimit(key: string, duration?: number): void;
  getRatelimit(key: string): Ratelimit | undefined;
};

const RatelimitContext = createContext<RatelimitContextType | undefined>(
  undefined,
);

export const RatelimitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ratelimits, setRatelimits] = useState<Ratelimit[]>([]);

  const isRateLimited = useCallback(
    (key: string) =>
      ratelimits.find((ratelimit) => ratelimit.key === key) !== undefined,
    [ratelimits],
  );

  const addRateLimit = useCallback(
    async (key: string, duration: number = 5000) => {
      setRatelimits((newRateLimits) => {
        if (isRateLimited(key)) return newRateLimits;
        newRateLimits.push({
          key,
          duration,
          startedAt: new Date(),
        });
        return newRateLimits;
      });
      setTimeout(
        () =>
          setRatelimits((newRateLimits) =>
            newRateLimits.filter((ratelimit) => ratelimit.key !== key),
          ),
        duration,
      );
    },
    [isRateLimited],
  );

  const getRatelimit = useCallback(
    (key: string) => ratelimits.find((ratelimit) => ratelimit.key === key),
    [ratelimits],
  );

  return (
    <RatelimitContext.Provider
      value={{
        ratelimits,
        isRateLimited,
        addRateLimit,
        getRatelimit,
      }}
    >
      {children}
    </RatelimitContext.Provider>
  );
};

export const useRatelimit = () => {
  const context = useContext(RatelimitContext);
  if (context === undefined) {
    throw new Error("useRatelimit must be used within a RatelimitProvider");
  }
  return context;
};

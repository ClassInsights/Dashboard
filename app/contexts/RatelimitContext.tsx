"use client";
import { createContext, useCallback, useState, useContext } from "react";

type RatelimitContextType = {
  ratelimits: string[];
  isRateLimited(key: string): boolean;
  addRateLimit(key: string): void;
};

const RatelimitContext = createContext<RatelimitContextType | undefined>(
  undefined,
);

export const RatelimitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ratelimits, setRatelimits] = useState<string[]>([]);

  const isRateLimited = useCallback(
    (key: string) => ratelimits.includes(key),
    [ratelimits],
  );

  const addRateLimit = useCallback(
    async (key: string) => {
      setRatelimits((newRateLimits) => {
        if (newRateLimits.find((name) => name !== key)) return newRateLimits;
        return [...newRateLimits, key];
      });
      setTimeout(() => {
        setRatelimits((newRateLimits) =>
          newRateLimits.filter((name) => name !== key),
        );
      }, 5000);
    },
    [ratelimits],
  );

  return (
    <RatelimitContext.Provider
      value={{
        ratelimits,
        isRateLimited,
        addRateLimit,
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

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Action from "../types/alertAction";
import { usePathname, useSearchParams } from "next/navigation";

type AlertContextType = {
  message: string;
  actions: Action[];
  show: (message: string, actions?: Action[]) => void;
  hide: () => void;
  isVisible: boolean;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const path = usePathname();
  const query = useSearchParams();

  useEffect(() => setIsVisible(false), [path, query]);

  const show = useCallback(
    (message: string, actions?: Action[]) => {
      if (isVisible) {
        setIsVisible(false);
        setTimeout(() => {
          setMessage(message);
          setActions(actions || []);
          setIsVisible(true);
        }, 150);
      } else {
        setMessage(message);
        setActions(actions || []);
        setIsVisible(true);
      }
    },
    [isVisible],
  );

  const hide = useCallback(() => setIsVisible(false), []);

  return (
    <AlertContext.Provider
      value={{
        message,
        actions,
        show,
        hide,
        isVisible,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context == null) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

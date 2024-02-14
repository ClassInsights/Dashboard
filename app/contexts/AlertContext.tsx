"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

  const timeout = useRef<NodeJS.Timeout | undefined>();

  const path = usePathname();
  const query = useSearchParams();

  // Hide alert when path or query changes
  useEffect(() => setIsVisible(false), [path, query]);

  const show = useCallback(
    (message: string, actions?: Action[]) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
        setIsVisible(false);
        setTimeout(() => show(message, actions), 10);
        return;
      }

      setMessage(message);
      setActions(actions || []);
      setIsVisible(true);

      timeout.current = setTimeout(() => {
        timeout.current = undefined;
        setIsVisible(false);
      }, 3000);
    },
    [isVisible, timeout.current],
  );

  return (
    <AlertContext.Provider
      value={{
        message,
        actions,
        show,
        hide: () => setIsVisible(false),
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

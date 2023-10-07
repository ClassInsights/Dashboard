"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Action from "../types/alertAction";

type AlertContextType = {
  message: string;
  actions: Action[];
  show: (message: string, actions?: Action[]) => void;
  hide: () => void;
  isVisible: boolean;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<string>("Du hast gewonnen!");
  const [actions, setActions] = useState<Action[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback((message: string, actions?: Action[]) => {
    hide();
    setMessage(message);
    setActions(actions || []);
    setIsVisible(true);
  }, []);

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

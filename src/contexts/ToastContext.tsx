import { createContext, useContext, useRef, useState } from "react";

export type ToastType = {
  message: string;
  type: MessageType;
  isVisible: boolean;
};

export type MessageType = "error" | "success";

type ToastContextType = {
  /** Show a toast message
   * @param message The message to display
   * @param type The type of the message (error or success)
   * @param duration The duration of the message in milliseconds (default: 4000)
   */
  showMessage: (message: string, type?: MessageType, duration?: number) => void;
  /** Whether the toast is currently visible */
  isVisible: boolean;
  /** The type of the toast message */
  type: MessageType;
  /** The message to display */
  message: string;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastType>({ message: "", isVisible: false, type: "success" });
  const timeoutRef = useRef<number | undefined>(undefined);

  /** Show a toast message */
  const showMessage = (message: string, type: MessageType = "success", duration?: number) => {
    if (toast.isVisible) {
      setToast((prev) => ({ ...prev, isVisible: false }));
      clearTimeout(timeoutRef.current);
      setTimeout(() => {
        setToast({ message, type, isVisible: true });
        const newTimeoutId = window.setTimeout(
          () => setToast((prev) => ({ ...prev, isVisible: false })),
          duration ?? 4000,
        );
        timeoutRef.current = newTimeoutId;
      }, 500);
      return;
    }

    setToast({ message, type, isVisible: true });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const newTimeoutId = window.setTimeout(
      () => setToast((prev) => ({ ...prev, isVisible: false })),
      duration ?? 4000,
    );

    timeoutRef.current = newTimeoutId;
  };

  return (
    <ToastContext.Provider
      value={{ showMessage, isVisible: toast.isVisible, type: toast.type, message: toast.message }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

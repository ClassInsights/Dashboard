import { useToast } from "@/contexts/ToastContext";

const ToastMessage = () => {
  const { isVisible, type, message } = useToast();

  return (
    <div
      className={`fixed top-6 left-1/2 z-50 max-w-2xl -translate-x-1/2 transform transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-[400%]"
      }`}
    >
      <p
        className={`rounded-full px-5 py-2 text-center text-background shadow-lg ${type === "success" ? "bg-primary" : "bg-destructive"}`}
      >
        {message}
      </p>
    </div>
  );
};

export default ToastMessage;

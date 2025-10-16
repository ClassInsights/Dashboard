import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

type CommandButtonProps = {
  label: string;
  disabled: boolean;
  alertDescription: string;
  action: () => void;
  trigger: React.ReactNode;
};

const CommandButton = ({
  label,
  disabled,
  alertDescription,
  action,
  trigger,
}: CommandButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.shiftKey) {
      action();
      return;
    }

    setIsOpen(true);
  };

  const handleAction = () => {
    action();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger disabled={disabled} onClick={handleTriggerClick} asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent onClickOutside={() => setIsOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Sind Sie sich sicher?</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          <AlertDialogDescription>
            Pro-Tipp: Shift + Klick um Bestätigung zu überspringen
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>{label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommandButton;

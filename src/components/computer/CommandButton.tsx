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
import type { LucideProps } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type CommandButtonProps = {
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  disabled: boolean;
  alertDescription: string;
  action: () => void;
};

const CommandButton = ({
  label,
  icon: Icon,
  disabled,
  alertDescription,
  action,
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
        <Button variant="outline">
          <Icon />
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClickOutside={() => setIsOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
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

"use client";

import { useContext, useState, createContext } from "react";
import Modal from "./Modal";

type LinkGroupContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const LinkGroupModal = () => {
  const modal = useLinkGroupModal();

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.toggle}>
      <div className="h-16 w-full" />
    </Modal>
  );
};

const LinkedGroupContext = createContext<LinkGroupContextType | undefined>(
  undefined,
);

export const LinkGroupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <LinkedGroupContext.Provider value={{ isOpen, toggle }}>
      {children}
    </LinkedGroupContext.Provider>
  );
};

export const useLinkGroupModal = (): LinkGroupContextType => {
  const context = useContext(LinkedGroupContext);
  if (context === undefined) {
    throw new Error(
      "useLinkGroupModal must be used within a LinkGroupProvider",
    );
  }
  return context;
};

export default LinkGroupModal;

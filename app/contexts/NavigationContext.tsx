"use client";

import { createContext, useContext, useCallback, useState } from "react";

export enum Page {
  HOME,
  ROOMS,
}

export type NavigationContextType = {
  currentPage: Page;
  setPage: (page: Page, props?: any) => void;
  props?: any;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [props, setProps] = useState<any>();

  const setPage = useCallback((page: Page, pageProps?: any) => {
    setCurrentPage(page);
    setProps(pageProps);
  }, []);
  return (
    <NavigationContext.Provider
      value={{ currentPage, setPage: setCurrentPage, props }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

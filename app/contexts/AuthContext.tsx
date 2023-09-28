"use client";

import { createContext, useEffect, useState, useContext } from "react";

export type AuthContextType = {
  token: String | undefined;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const initializeToken = async () => {
    // const response = await axiosInstance.get('/login/pc');
    // console.log('Response', response);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToken("testToken");
    setLoading(false);
  };

  useEffect(() => {
    initializeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};

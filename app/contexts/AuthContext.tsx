'use client';

import { initialize } from 'next/dist/server/lib/render-server';
import { createContext, useEffect, useState } from 'react';

export type AuthContextType = {
  token: String;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String>('');
  const [loading, setLoading] = useState<boolean>(true);

  const initializeToken = async () => {
    console.log('Token initialized');
    setToken('test');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  useEffect(() => {
    initializeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
      }}
    >
      {loading ? <h1>LOADING</h1> : children}
    </AuthContext.Provider>
  );
};

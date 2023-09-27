'use client';

import axios from 'axios';
import { Console } from 'console';
import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

export type AuthContextType = {
  token: String | undefined;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<String | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const initializeToken = async () => {
    // const response = await axiosInstance.get('/login/pc');
    // console.log('Response', response);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToken('testToken');
    setLoading(false);
  };

  useEffect(() => {
    initializeToken();
  }, []);

  if (loading) return <h1>LOADING</h1>;
  if (token == null) return <h1>NO TOKEN</h1>;

  return (
    <AuthContext.Provider
      value={{
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

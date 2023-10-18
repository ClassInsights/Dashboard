"use client";

import Image from "next/image";
import { ThemeMode, useTheme } from "../contexts/ThemeContext";
import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const auth = useAuth();
  const theme = useTheme();
  const switchTheme = useCallback(
    () =>
      theme.setTheme(
        theme.themeMode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark,
      ),
    [theme],
  );
  return (
    <nav className="flex w-full items-center justify-between bg-background py-4 dark:bg-dark-background">
      <div
        className="flex cursor-pointer items-center"
        onClick={() => router.push("/")}
      >
        <Image
          src="/logo.svg"
          alt="ClassInsights Logo"
          width={25}
          height={25}
          className="h-8 w-8"
          draggable={false}
        />
        <h3 className="ml-4 select-none text-xl">ClassInsights</h3>
      </div>
      <div className="flex items-center">
        <div className="mr-4 hidden items-center sm:flex">
          <p className="select-none">{auth.data?.name ?? "Unbekannt"}</p>
        </div>
        <div onClick={switchTheme}>
          <Image
            src="/brightness.svg"
            alt="Brightness Switch"
            width={25}
            height={25}
            className="onBackground-light dark:onBackground-dark cursor-pointer transition-transform dark:rotate-180"
            draggable={false}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

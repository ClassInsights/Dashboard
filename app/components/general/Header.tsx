"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ContainerPreset from "../containers/ContainerPreset";

type HeaderProps = {
  title: string;
  subtitle?: string;
  previousPath?: string;
  reloadAction?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  previousPath,
  reloadAction,
}) => {
  const router = useRouter();
  return (
    <div className="mb-10 select-none">
      <div className="flex w-full items-center justify-between gap-10">
        <div
          className={`flex w-max ${
            previousPath !== undefined ? "cursor-pointer" : ""
          }`}
          onClick={() =>
            previousPath !== undefined ? router.push(previousPath) : null
          }
        >
          {previousPath !== undefined && (
            <Image
              src="/arrow_left.svg"
              alt="Go back"
              width={25}
              height={25}
              className="onBackground-light dark:onBackground-dark mr-2 h-auto w-6"
              draggable={false}
            />
          )}
          <h1>{title}</h1>
        </div>
        {reloadAction && (
          <div
            className="dark:bg-primary-dark hidden shrink-0 cursor-pointer rounded-md bg-primary p-1.5 sm:block"
            onClick={reloadAction}
          >
            <Image
              src="/refresh.svg"
              alt="Refresh rooms"
              height={15}
              width={15}
              className="dark:onBackground-light onBackground-dark h-5 w-5"
              draggable={false}
            />
          </div>
        )}
      </div>
      {subtitle && <p className="mt-3 sm:w-3/4 lg:w-3/5">{subtitle}</p>}
      {reloadAction && (
        <button
          onClick={reloadAction}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-3 dark:bg-dark-primary sm:hidden"
        >
          <span className="text-background dark:text-dark-background">
            Aktualisieren
          </span>
        </button>
      )}
    </div>
  );
};

export default Header;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
            className="dark:bg-primary-dark cursor-pointer rounded-md bg-primary p-1.5"
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
    </div>
  );
};

export default Header;

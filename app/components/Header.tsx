"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  subtitle?: string;
  previousPath?: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, previousPath }) => {
  const router = useRouter();
  return (
    <div
      className="mb-10"
      onClick={() =>
        previousPath !== undefined ? router.push(previousPath) : null
      }
    >
      <div
        className={`flex items-center
    ${previousPath !== undefined ? "cursor-pointer" : ""}`}
      >
        {previousPath !== undefined && (
          <Image
            src="/arrow_left.svg"
            alt="Go back"
            width={25}
            height={25}
            className="onBackground-light dark:onBackground-dark mr-2"
            draggable={false}
          />
        )}
        <h1>{title}</h1>
      </div>
      {subtitle && <p className="mt-3 sm:w-3/4 lg:w-3/5">{subtitle}</p>}
    </div>
  );
};

export default Header;

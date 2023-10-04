import Image from "next/image";
import { Page, useNavigation } from "../contexts/NavigationContext";

type HeaderProps = {
  title: string;
  subtitle?: string;
  previousPage?: Page;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, previousPage }) => {
  const navigation = useNavigation();

  return (
    <div
      onClick={() =>
        previousPage !== undefined ? navigation.setPage(previousPage) : null
      }
    >
      <div
        className={`flex items-center
    ${previousPage !== undefined ? "cursor-pointer" : ""}`}
      >
        {previousPage !== undefined && (
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

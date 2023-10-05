import Image from "next/image";

interface ContainerWidgetProps {
  label: String;
  title: String;
  fullHeight?: boolean;
  showArrow?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Container: React.FC<ContainerWidgetProps> = ({
  label,
  title,
  fullHeight,
  showArrow,
  onClick,
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full rounded-lg bg-secondary px-5 py-3 dark:bg-dark-secondary
    ${fullHeight ? "h-full" : ""}
    ${showArrow ? "flex items-center justify-between" : ""}
    ${onClick ? "cursor-pointer" : ""}`}
    >
      <div>
        <p className="select-none text-sm text-tertiary dark:text-dark-primary">
          {label}
        </p>
        <h3 className="mt-1 select-none">{title}</h3>
      </div>
      {showArrow ? (
        <Image
          src="/arrow_right.svg"
          height={25}
          width={25}
          alt="Go forward"
          draggable={false}
          className="onBackground-light dark:tertiary-dark"
        />
      ) : (
        children
      )}
    </div>
  );
};

export default Container;

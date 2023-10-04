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
      className={`w-full rounded-lg bg-secondary px-5 py-3 shadow-sm shadow-secondary dark:bg-dark-secondary
    ${fullHeight ? "h-full" : ""}
    ${showArrow ? "flex items-center justify-between" : ""}
    ${onClick ? "cursor-pointer" : ""}`}
    >
      <div>
        <p className="select-none text-tertiary dark:text-dark-primary">
          {label}
        </p>
        <h3 className="select-none text-onBackground dark:text-dark-onBackground">
          {title}
        </h3>
      </div>
      {showArrow ? (
        <Image
          src="./arrow_right.svg"
          height={20}
          width={20}
          alt="Go forward"
        />
      ) : (
        children
      )}
    </div>
  );
};

export default Container;

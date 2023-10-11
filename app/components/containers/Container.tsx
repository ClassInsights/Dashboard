import Image from "next/image";

interface ContainerWidgetProps {
  showArrow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Container: React.FC<ContainerWidgetProps> = ({
  showArrow,
  onClick,
  disabled,
  children,
}) => {
  return (
    <div
      className={`w-full rounded-lg bg-secondary px-5 py-3 dark:bg-dark-secondary
    ${showArrow ? "flex items-center justify-between" : ""}
    ${onClick ? "cursor-pointer" : ""}
    ${disabled ? "opacity-70" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Container;

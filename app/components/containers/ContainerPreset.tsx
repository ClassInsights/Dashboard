import Image from "next/image";
import Container from "./Container";

type ContainerPresetProps = {
  label?: String;
  title?: String;
  showArrow?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

const ContainerPreset: React.FC<ContainerPresetProps> = ({
  label,
  title,
  showArrow,
  onClick,
  children,
}) => {
  return (
    <Container onClick={onClick} showArrow={showArrow}>
      <div>
        <p className="select-none text-sm text-tertiary dark:text-dark-primary">
          {label}
        </p>
        <h3 className={`select-none ${label ? "mt-1" : ""}`}>{title}</h3>
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
    </Container>
  );
};

export default ContainerPreset;

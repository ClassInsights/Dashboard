import Image from "next/image";

type ComputerActionProps = {
  computerId: number;
  iconPath: string;
  altText: string;
  action?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    computerId: number,
  ) => void;
  disabled?: boolean;
};

const ComputerAction: React.FC<ComputerActionProps> = ({
  computerId,
  iconPath,
  altText,
  action,
  disabled,
}) => {
  return (
    <div
      className="flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-tertiary dark:bg-dark-tertiary"
      onClick={(event) => {
        if (disabled) return;
        action && action(event, computerId);
      }}
    >
      <Image
        src={iconPath}
        width={10}
        height={10}
        alt={altText}
        className="onBackground-light dark:onBackground-dark h-4 w-auto"
      />
    </div>
  );
};

export default ComputerAction;

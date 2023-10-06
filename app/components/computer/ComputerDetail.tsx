import Image from "next/image";

type ComputerDetailProps = {
  value: string;
  iconPath: string;
  altText: string;
};

const ComputerDetail: React.FC<ComputerDetailProps> = ({
  value,
  iconPath,
  altText,
}) => {
  return (
    <div className="flex items-center">
      <Image
        src={iconPath}
        height={15}
        width={15}
        alt={altText}
        draggable={false}
        className="onBackground-light dark:onBackground-dark h-4 w-4"
      />
      <p className="ml-2">{value}</p>
    </div>
  );
};

export default ComputerDetail;

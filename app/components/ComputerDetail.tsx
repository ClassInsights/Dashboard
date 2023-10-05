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
    <div className="flex">
      <Image
        src={iconPath}
        height={15}
        width={15}
        alt={altText}
        className="onBackground-light dark:onBackground-dark"
      />
      <p className="ml-2">{value}</p>
    </div>
  );
};

export default ComputerDetail;

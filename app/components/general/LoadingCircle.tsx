import Image from "next/image";

const LoadingCircle = ({ height = "h-32" }: { height?: string }) => (
  <div className={`flex w-full items-center justify-center ${height}`}>
    <Image
      src="/progress.svg"
      height={20}
      width={20}
      alt="progess indicator"
      draggable={false}
      className="onBackground-light dark:onBackground-dark h-10 w-10 animate-spin"
    />
  </div>
);

export default LoadingCircle;

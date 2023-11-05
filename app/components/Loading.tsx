import Image from "next/image";

const Loading = () => {
  return (
    <>
      <nav className="absolute flex w-full items-center justify-between bg-background py-4 dark:bg-dark-background">
        <div className="flex items-center">
          <div className="animate-pulse rounded-full bg-onBackground dark:bg-dark-onBackground">
            <Image
              src="/logo.svg"
              alt="ClassInsights Logo"
              width={25}
              height={25}
              className="h-8 w-8 opacity-0"
              draggable={false}
            />
          </div>
          <div
            className="ml-4 animate-pulse select-none rounded-full bg-onBackground dark:bg-dark-onBackground"
            draggable={false}
          >
            <h3 className="select-none text-xl opacity-0">ClassInsights</h3>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 hidden items-center sm:flex">
            <div className="h-6 w-32 animate-pulse rounded-full bg-onBackground dark:bg-dark-onBackground" />
          </div>
          <div className="animate-pulse rounded-full bg-onBackground dark:bg-dark-onBackground">
            <Image
              src="/brightness.svg"
              alt="Brightness Switch"
              width={25}
              height={25}
              draggable={false}
              className="opacity-0"
            />
          </div>
        </div>
      </nav>
      <div className="flex h-screen w-full items-center justify-center">
        <Image
          src="/logo.svg"
          height={15}
          width={15}
          alt="ClassInsights Logo"
          draggable={false}
          className="h-auto w-1/5 animate-pulse"
        />
      </div>
    </>
  );
};

export default Loading;

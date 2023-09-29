import Image from "next/image";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 flex w-full select-none flex-col items-center justify-between pb-5 md:flex-row">
      <p className="text-onBackground dark:text-dark-onBackground">
        © {new Date().getFullYear()} HAK/HAS/HLW Landeck
      </p>
      <div>
        <a
          href="https://github.com/ClassInsights"
          target="_blank"
          draggable={false}
        >
          <div className="flex items-center">
            <p className="mr-2 text-onBackground dark:text-dark-onBackground">
              GitHub
            </p>
            <Image
              src="/github.svg"
              alt="GitHub"
              height={50}
              width={50}
              draggable={false}
              className={`onBackground-dark dark:onBackground-light h-auto w-auto cursor-pointer`}
            />
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

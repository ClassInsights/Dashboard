import Image from "next/image";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 flex w-full select-none flex-col items-center justify-between pb-3 md:flex-row">
      <small className="text-onBackground dark:text-dark-onBackground">
        © {new Date().getFullYear()} HAK/HAS/HLW Landeck
      </small>
      <div>
        <a
          href="https://github.com/ClassInsights"
          target="_blank"
          draggable={false}
        >
          <div className="flex items-center">
            <small className="mr-2">GitHub</small>
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

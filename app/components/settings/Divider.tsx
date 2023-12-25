const Divider = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div
      className={`flex justify-center 
    ${vertical ? "px-12" : "w-full py-12"}`}
    >
      <div
        className={`bg-secondary opacity-40 dark:bg-dark-secondary ${
          vertical ? "my-5 w-0.5" : "mx-5 h-0.5 w-full"
        }`}
      />
    </div>
  );
};

export default Divider;

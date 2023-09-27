interface ContainerWidgetProps {
  title: String;
  label: String;
  fullHeight?: boolean;
  children: React.ReactNode;
}

const Container: React.FC<ContainerWidgetProps> = ({
  title,
  label,
  fullHeight,
  children,
}) => {
  return (
    <div
      className={`w-full rounded-lg bg-secondary px-5 py-3 dark:bg-dark-secondary
    ${fullHeight ? "h-full" : ""}`}
    >
      <p className="select-none text-tertiary dark:text-dark-primary">
        {label}
      </p>
      <h3 className="select-none text-onBackground dark:text-dark-onBackground">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default Container;

import { ThemeMode, useTheme } from "../contexts/ThemeContext";

type ConfigSectionType = {
  title: string;
  description: string;
  action: () => void;
  actionLabel: string;
};

const ConfigSection: React.FC<ConfigSectionType> = ({
  title,
  description,
  action,
  actionLabel,
}) => {
  const theme = useTheme();
  return (
    <section className="mt-10 flex-col xs:flex-row">
      <h2 className="select-light dark:select-dark text-onBackground dark:text-dark-onBackground">
        {title}
      </h2>
      <div className="flex flex-col justify-between xs:flex-row xs:items-center">
        <p className="select-light dark:select-dark text-onBackground dark:text-dark-onBackground">
          {description}
        </p>
        <button
          onClick={action}
          className="mt-4 rounded-lg bg-primary px-4 py-3 xs:ml-20 xs:mt-0"
        >
          <span className="text-background dark:text-dark-background">
            {actionLabel}
          </span>
        </button>
      </div>
    </section>
  );
};

export default ConfigSection;

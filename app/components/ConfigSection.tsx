import { ThemeMode, useTheme } from '../contexts/ThemeContext';

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
    <section className='mt-10 flex md:items-center justify-between flex-col md:flex-row'>
      <div className='flex-shrink'>
        <h2
          className={`text-onBackground dark:text-dark-onBackground
          ${theme.themeMode == ThemeMode.Dark ? 'select-dark' : 'select-light'}`}
        >
          {title}
        </h2>
        <p
          className={`text-onBackground dark:text-dark-onBackground
        ${theme.themeMode == ThemeMode.Dark ? 'select-dark' : 'select-light'}`}
        >
          {description}
        </p>
      </div>
      <button onClick={action} className='mt-2 md:mt-0 bg-primary py-3 px-4 rounded-lg md:ml-3'>
        <span className='text-background dark:text-dark-background'>{actionLabel}</span>
      </button>
    </section>
  );
};

export default ConfigSection;

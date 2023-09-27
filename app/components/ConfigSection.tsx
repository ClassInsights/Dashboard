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
    <section className='mt-10 flex-col xs:flex-row'>
      <h2
        className={`text-onBackground dark:text-dark-onBackground
          ${theme.themeMode == ThemeMode.Dark ? 'select-dark' : 'select-light'}`}
      >
        {title}
      </h2>
      <div className='flex flex-col xs:flex-row xs:items-center justify-between'>
        <p
          className={`text-onBackground dark:text-dark-onBackground
        ${theme.themeMode == ThemeMode.Dark ? 'select-dark' : 'select-light'}`}
        >
          {description}
        </p>
        <button onClick={action} className='mt-4 xs:mt-0 bg-primary py-3 px-4 rounded-lg xs:ml-20'>
          <span className='text-background dark:text-dark-background'>{actionLabel}</span>
        </button>
      </div>
    </section>
  );
};

export default ConfigSection;

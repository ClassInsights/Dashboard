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
  return (
    <section className='my-3 flex items-center justify-between'>
      <div className='flex-shrink'>
        <h2 className='text-onBackground dark:text-dark-onBackground'>{title}</h2>
        <p className='text-onBackground dark:text-dark-onBackground'>{description}</p>
      </div>
      <button onClick={action}>
        <span className='text-onBackground dark:text-dark-onBackground'>{actionLabel}</span>
      </button>
    </section>
  );
};

export default ConfigSection;

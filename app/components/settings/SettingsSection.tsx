type SettingsSectionProps = {
  title: string;
  description: string;
  info?: React.ReactNode;
  input: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  info,
  input,
}) => {
  return (
    <section className="relative flex flex-col">
      <h2 className="select-none pb-2 ">{title}</h2>
      <div className="flex w-full flex-col items-start justify-between gap-8 sm:flex-row">
        <div className="w-full">
          <p className="select-none">{description}</p>
          <div className="pt-4">{info}</div>
        </div>
        <div className="w-full sm:w-1/3">{input}</div>
      </div>
    </section>
  );
};

export default SettingsSection;

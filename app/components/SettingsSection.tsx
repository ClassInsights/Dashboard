type SettingsSectionProps = {
  title: string;
  description: string;
  info: React.ReactNode;
  input: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  info,
  input,
}) => {
  return (
    <section className="relative mt-10 flex w-full flex-col">
      <h2 className="pb-2">{title}</h2>
      <div className="flex w-full flex-col items-start justify-between gap-8 sm:flex-row">
        <div>
          <p>{description}</p>
          <div className="pt-4">{info}</div>
        </div>
        <div>{input}</div>
      </div>
    </section>
  );
};

export default SettingsSection;
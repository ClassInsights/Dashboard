type InfluxPartProps = {
  title: string;
  description: string;
  info?: React.ReactNode;
  gap?: string;
  inline?: boolean;
  input: React.ReactNode;
};

const InfluxPart: React.FC<InfluxPartProps> = ({
  title,
  description,
  info,
  gap = "gap-8",
  inline,
  input,
}) => {
  return (
    <div className="pt-6">
      <h3 className="select-none pb-1.5">{title}</h3>
      <div
        className={`flex w-full items-start justify-between
        ${inline ? "flex-col sm:flex-row" : "flex-col"}
        ${gap}`}
      >
        <div className="w-full select-none lg:w-3/4">
          <p>{description}</p>
          {info !== undefined && <div className="pt-1">{info}</div>}
        </div>
        <div className={inline ? "w-full sm:w-1/3" : "w-full"}>{input}</div>
      </div>
    </div>
  );
};

export default InfluxPart;

interface ContainerWidgetProps {
  title: String;
  label: String;
  fullHeight?: boolean;
  children: React.ReactNode;
}

const Container: React.FC<ContainerWidgetProps> = ({ title, label, fullHeight, children }) => {
  return (
    <div
      className={`w-full shadow-sm shadow-secondary bg-secondary rounded-lg px-5 py-3 
    ${fullHeight ? 'h-full' : ''}`}
    >
      <p className='text-tertiary'>{label}</p>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default Container;

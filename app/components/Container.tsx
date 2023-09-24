interface ContainerWidgetProps {
  title: String;
  label: String;
  fullHeight?: boolean;
  children: React.ReactNode;
}

const Container: React.FC<ContainerWidgetProps> = ({ title, label, fullHeight, children }) => {
  return (
    <div
      className={`w-full bg-secondary dark:bg-dark-secondary rounded-lg px-5 py-3
    ${fullHeight ? 'h-full' : ''}`}
    >
      <p className='text-tertiary dark:text-dark-primary select-none'>{label}</p>
      <h3 className='text-onBackground dark:text-dark-onBackground select-none'>{title}</h3>
      {children}
    </div>
  );
};

export default Container;

import Container from "./Container";

type ListContainerProps = {
  title: String;
  children?: React.ReactNode;
};

const ListContainer: React.FC<ListContainerProps> = ({ title, children }) => {
  return (
    <Container>
      <h3 className="mb-1.5">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </Container>
  );
};

export default ListContainer;

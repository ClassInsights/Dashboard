import { useParams } from "react-router";

const Computer = () => {
  const { id } = useParams();
  return <div>Computer ID: {id}</div>;
};

export default Computer;

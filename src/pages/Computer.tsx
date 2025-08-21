import LogArea from "@/components/computer/LogArea";
import useComputers from "@/hooks/use-computers";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const Computer = () => {
  const { id } = useParams();
  const { data: computers } = useComputers();

  const navigate = useNavigate();

  const computer = computers?.find((computer) => computer.computerId.toString() === id);

  useEffect(() => {
    if (!computer) navigate("/computer");
  }, [computer, navigate]);

  if (!computer) return null;

  return (
    <div>
      <LogArea computerId={computer.computerId} />
    </div>
  );
};

export default Computer;

import { useState } from "react";
import Spacing from "../Spacing";
import DatePicker from "./DatePicker";
import Log from "./Log";

const LogArea = ({ computerId }: { computerId: number }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logsPerPage, setLogsPerPage] = useState(10);

  return (
    <>
      <h2>Client-Log</h2>
      <p className="pb-2">Das Log wird automatisch alle 10 Sekunden aktualisiert.</p>
      <DatePicker date={currentDate} onChange={setCurrentDate} />
      <Log
        key={currentDate.formatToDay()}
        computerId={computerId}
        currentDate={currentDate}
        logsPerPage={logsPerPage}
        setLogsPerPage={setLogsPerPage}
      />
      <Spacing />
    </>
  );
};

export default LogArea;

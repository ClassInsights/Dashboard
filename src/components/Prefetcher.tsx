import useComputers from "@/hooks/use-computers";
import useConfiguration from "@/hooks/use-configuration";
import useRooms from "@/hooks/use-rooms";
import Loading from "@/pages/Loading";
import { useEffect, useRef, useState } from "react";

const Prefetcher = ({ children }: { children: React.ReactNode }) => {
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const startTimeRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const computers = useComputers();
  const rooms = useRooms();
  const config = useConfiguration();

  const isLoading = computers.isLoading || rooms.isLoading || config.isLoading;

  useEffect(() => {
    if (isLoading && startTimeRef.current === undefined) {
      startTimeRef.current = Date.now();
      setShouldShowContent(false);
    } else if (!isLoading && startTimeRef.current !== undefined) {
      const diff = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 500 - diff);

      timeoutRef.current = window.setTimeout(() => {
        setShouldShowContent(true);
        startTimeRef.current = undefined;
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading]);

  // TODO: add error pages

  if (computers.error) {
    return <div>Computer Error: {computers.error.message}</div>;
  }

  if (rooms.error) {
    return <div>Room Error: {rooms.error.message}</div>;
  }

  if (config.error) {
    return <div>Config Error: {config.error.message}</div>;
  }

  if (isLoading || !shouldShowContent) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default Prefetcher;

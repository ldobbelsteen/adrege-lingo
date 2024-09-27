import React, { useCallback, useEffect, useState } from "react";

export function Elapsed(props: { start: Date }) {
  const [elapsed, setElapsed] = useState(new Date(0));

  const updateElapsed = useCallback(() => {
    setElapsed(new Date(new Date().getTime() - props.start.getTime()));
  }, [props.start, setElapsed]);

  useEffect(() => {
    updateElapsed();
  }, [updateElapsed]);

  useEffect(() => {
    const interval = setInterval(updateElapsed, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [updateElapsed]);

  return (
    <span className="m-2 p-2">
      {elapsed.getMinutes().toString().padStart(2, "0")}:
      {elapsed.getSeconds().toString().padStart(2, "0")}
    </span>
  );
}

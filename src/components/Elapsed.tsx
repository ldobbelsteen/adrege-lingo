import React, { useEffect, useState } from "react";

export function Elapsed(props: { start: Date }) {
  const [elapsed, setElapsed] = useState(new Date(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(new Date(new Date().getTime() - props.start.getTime()));
    }, 1000);
    return () => clearInterval(interval);
  }, [props.start]);

  return (
    <span className="m-2 p-2">
      {elapsed.getMinutes().toString().padStart(2, "0")}:
      {elapsed.getSeconds().toString().padStart(2, "0")}
    </span>
  );
}

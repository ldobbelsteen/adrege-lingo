import React, { useCallback, useState } from "react";
import { Button } from "./Button";

export const WindowToggle = (props: {
  url: string;
  openText: string;
  closeText: string;
}) => {
  const [instance, setInstance] = useState<Window>();

  const openInstance = useCallback(() => {
    setInstance((previous) => {
      if (previous) {
        previous.close();
      }

      const features = `
        width=${0.9 * window.innerWidth},
        height=${0.9 * window.innerHeight}
      `;

      const newInstance = window.open(props.url, undefined, features);
      if (!newInstance) {
        return undefined;
      }

      newInstance.addEventListener("beforeunload", () => {
        setInstance(undefined);
      });
      window.addEventListener("beforeunload", () => {
        newInstance.close();
      });

      return newInstance;
    });
  }, [props.url]);

  return instance ? (
    <Button
      onClick={() => {
        instance.close();
        setInstance(undefined);
      }}
    >
      {props.closeText}
    </Button>
  ) : (
    <Button onClick={openInstance}>{props.openText}</Button>
  );
};

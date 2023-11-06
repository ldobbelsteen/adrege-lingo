import React, { useEffect, useState } from "react";

export const Window = (props: { url: string }) => {
  const [instance, setInstance] = useState<Window>();

  useEffect(() => {
    if (instance === undefined) {
      const features = `
        width=${0.9 * window.innerWidth},
        height=${0.9 * window.innerHeight}
      `;

      const newInstance = window.open(props.url, undefined, features);
      if (!newInstance) {
        console.error("popup window aanmaken niet gelukt :(");
        return;
      }

      setInstance(newInstance);

      newInstance.onbeforeunload = () => {
        window.onbeforeunload = null;
        setInstance(undefined);
      };

      window.onbeforeunload = () => {
        newInstance.onbeforeunload = null;
        newInstance.close();
      };
    }
  }, [props.url, instance]);

  return <></>;
};

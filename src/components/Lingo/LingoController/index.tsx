import type React from "react";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { useScreen } from "../../../utils/storage";
import { Multiselect } from "../../Multiselect";
import { Title } from "../../Title";
import { Screen } from "../index";
import { LingoCardController } from "./LingoCardController";
import { LingoGuessController } from "./LingoGuessController";
import { LingoPointController } from "./LingoPointController";
import { LingoSettingsController } from "./LingoSettingsController";

export const LingoController = () => {
  const [screen, setScreen] = useScreen();

  const component = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.Settings: {
        return <LingoSettingsController />;
      }
      case Screen.Guessing: {
        return <LingoGuessController />;
      }
      case Screen.Cards: {
        return <LingoCardController />;
      }
      case Screen.Points: {
        return <LingoPointController />;
      }
    }
  }, [screen]);

  return (
    <main
      className={"w-full min-h-full text-center text-wit text-xl bg-donkerrood"}
    >
      <Toaster position="top-right" />
      <div className="flex justify-center items-center bg-donkerderrood p-2">
        <Title
          text="Lingo controlepaneel"
          textSize="text-2xl"
          className="mx-4"
        />
        <Multiselect
          selected={screen}
          setSelected={setScreen}
          options={Object.values(Screen).reduce(
            (acc, scr) => Object.assign(acc, { [scr]: scr }),
            {},
          )}
        />
      </div>
      <div className="flex flex-col justify-center items-center p-2 gap-1">
        {component}
      </div>
    </main>
  );
};

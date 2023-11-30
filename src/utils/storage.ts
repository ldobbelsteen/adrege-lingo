import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Screen } from "../components/Lingo";

import { Card } from "./card";
import { Guesses } from "./guesses";

declare global {
  interface GlobalEventHandlersEventMap {
    storageLocally: CustomEvent<string>;
  }
}

export function clearStorage() {
  localStorage.clear();
}

export function useScreen() {
  return useStoredState("screen", Screen.Settings);
}

export function useTeamMode() {
  return useStoredState("teamMode", true);
}

export function useCardPrefilled() {
  return useStoredState("cardPrefilled", 8);
}

export function useCardDimensions() {
  return useStoredState("cardDimensions", 5);
}

export function useCardMaxValue() {
  return useStoredState("cardMaxValue", 70);
}

export function useMaxGuesses() {
  return useStoredState("maxGuesses", 5);
}

export function useFirstTeamCard() {
  return useStoredState<Card | null>("firstTeamCard", null);
}

export function useSecondTeamCard() {
  return useStoredState<Card | null>("secondTeamCard", null);
}

export function useFirstTeamSelected() {
  return useStoredState("firstTeamSelected", true);
}

export function useGuesses() {
  return useStoredState<Guesses | null>("guesses", null);
}

export function useFirstTeamGuessing() {
  return useStoredState("firstTeamGuessing", true);
}

export function useGuessingStatus() {
  return useStoredState<"running" | "paused" | "finished">(
    "guessingStatus",
    "running",
  );
}

export function useFirstTeamPoints() {
  return useStoredState("firstTeamPoints", 0);
}

export function useSecondTeamPoints() {
  return useStoredState("secondTeamPoints", 0);
}

export function useShowWord() {
  return useStoredState("showWord", false);
}

export function useFiveLetterWords() {
  return useStoredState("fiveLetterWords", [
    "adten",
    "corps",
    "storm",
    "kater",
    "kerst",
    "bezat",
    "demos",
    "panda",
    "knaks",
    "prela",
  ]);
}

export function useSixLetterWords() {
  return useStoredState("sixLetterWords", [
    "keizer",
    "fundum",
    "taphap",
    "burger",
    "redout",
    "soggen",
    "zuipen",
    "tweede",
    "barfje",
    "koprol",
    "sjaars",
    "nectar",
    "bakken",
    "pilsje",
    "itakru",
    "consti",
  ]);
}

export function useSevenLetterWords() {
  return useStoredState("sevenLetterWords", [
    "praeses",
    "brassen",
    "lustrum",
    "alcohol",
    "knorren",
    "kwarrel",
    "dispuut",
    "sporten",
  ]);
}

function useStoredState<T>(
  stateKey: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const setStorage = useCallback(
    (value: T) => localStorage.setItem(stateKey, JSON.stringify(value)),
    [stateKey],
  );

  const getStorage = useCallback((): T => {
    const value = localStorage.getItem(stateKey);
    if (!value || value === "null") {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  }, [defaultValue, stateKey]);

  const [state, setState] = useState(getStorage);

  const storageEventHandler = useCallback(
    (ev: StorageEvent) => {
      if (ev.key === stateKey) {
        setState(getStorage());
      }
    },
    [stateKey, getStorage],
  );

  const localStorageEventHandler = useCallback(
    (ev: CustomEvent<string>) => {
      if (ev.detail === stateKey) {
        setState(getStorage());
      }
    },
    [stateKey, getStorage],
  );

  useEffect(() => {
    window.addEventListener("storage", storageEventHandler);
    window.addEventListener("storageLocally", localStorageEventHandler);
    return () => {
      window.removeEventListener("storage", storageEventHandler);
      window.removeEventListener("storageLocally", localStorageEventHandler);
    };
  }, [storageEventHandler, localStorageEventHandler]);

  const setStateWrapper: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setState((prevState) => {
        const newValue =
          action instanceof Function ? action(prevState) : action;
        setStorage(newValue);
        window.dispatchEvent(
          new CustomEvent("storageLocally", { detail: stateKey }),
        );
        return newValue;
      });
    },
    [stateKey, setState, setStorage],
  );

  return [state, setStateWrapper];
}

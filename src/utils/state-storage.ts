import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Screen } from "../components/Lingo";
import { Card } from "./lingo-card";
import { Guesses } from "./lingo-guesses";
import { create1DArray } from "./misc";

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

export function useTeamCount() {
  return useStoredState("teamCount", 2);
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

export function useCards() {
  const [teamCount] = useTeamCount();

  return useStoredState<(Card | null)[]>(
    "cards",
    create1DArray(teamCount, null),
    jsonArrayParser(Card.fromJson),
  );
}

export function useCardIndex() {
  return useStoredState("cardIndex", 0);
}

export function useGuesses() {
  return useStoredState<Guesses | null>("guesses", null, Guesses.fromJson);
}

export function useGuessingTeam() {
  return useStoredState("guessingTeam", 0);
}

function useStoredState<T>(
  stateKey: string,
  defaultValue: T,
  fromJson?: (s: string) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const setStorage = useCallback(
    (value: T) => localStorage.setItem(stateKey, JSON.stringify(value)),
    [stateKey],
  );

  const getStorage = useCallback((): T => {
    const value = localStorage.getItem(stateKey);
    if (value) {
      return fromJson ? fromJson(value) : (JSON.parse(value) as T);
    } else {
      return defaultValue;
    }
  }, [defaultValue, stateKey, fromJson]);

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

function jsonArrayParser<T>(elementParser: (elementJson: string) => T) {
  return (arrayJson: string) => {
    const result = [];
    const rawValues = JSON.parse(arrayJson) as unknown[];
    for (const rawValue of rawValues.values()) {
      if (rawValue === null) {
        result.push(null);
      } else {
        const stringified = JSON.stringify(rawValue);
        const value = elementParser(stringified);
        result.push(value);
      }
    }
    return result;
  };
}

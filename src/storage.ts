import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

declare global {
  interface GlobalEventHandlersEventMap {
    storageLocally: CustomEvent<string>;
  }
}

export function useStoredStateWithDefault<T>(
  stateKey: string,
  defaultValue: T,
  fromJson?: (s: string) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const setStoredState = useCallback(
    (value: T) => localStorage.setItem(stateKey, JSON.stringify(value)),
    [stateKey],
  );

  useEffect(() => {
    if (localStorage.getItem(stateKey) === null) {
      setStoredState(defaultValue);
    }
  }, [stateKey, setStoredState, defaultValue]);

  const getStoredState = useCallback((): T => {
    const value = localStorage.getItem(stateKey) as string;
    return fromJson ? fromJson(value) : (JSON.parse(value) as T);
  }, [stateKey, fromJson]);

  const [state, setState] = useState(getStoredState);
  useEffect(() => setState(getStoredState()), [getStoredState]);

  const storageEventHandler = useCallback(
    (ev: StorageEvent) => {
      if (ev.key === stateKey) {
        setState(getStoredState());
      }
    },
    [stateKey, getStoredState],
  );

  const localStorageEventHandler = useCallback(
    (ev: CustomEvent<string>) => {
      if (ev.detail === stateKey) {
        setState(getStoredState());
      }
    },
    [stateKey, getStoredState],
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
        setStoredState(newValue);
        window.dispatchEvent(
          new CustomEvent("storageLocally", { detail: stateKey }),
        );
        return newValue;
      });
    },
    [stateKey, setState, setStoredState],
  );

  return [state, setStateWrapper];
}

export function useStoredState<T>(
  stateKey: string,
  fromJson?: (s: string) => T,
): [T | null, Dispatch<SetStateAction<T | null>>] {
  const getStoredState = useCallback((): T | null => {
    const value = localStorage.getItem(stateKey);
    if (value === null) return null;
    return fromJson ? fromJson(value) : (JSON.parse(value) as T);
  }, [stateKey, fromJson]);

  const setStoredState = useCallback(
    (value: T | null) => {
      if (value === null) {
        localStorage.removeItem(stateKey);
      } else {
        localStorage.setItem(stateKey, JSON.stringify(value));
      }
    },
    [stateKey],
  );

  const [state, setState] = useState(getStoredState);
  useEffect(() => setState(getStoredState()), [getStoredState]);

  const storageEventHandler = useCallback(
    (ev: StorageEvent) => {
      if (ev.key === stateKey) {
        setState(getStoredState());
      }
    },
    [stateKey, getStoredState],
  );

  const localStorageEventHandler = useCallback(
    (ev: CustomEvent<string>) => {
      if (ev.detail === stateKey) {
        setState(getStoredState());
      }
    },
    [stateKey, getStoredState],
  );

  useEffect(() => {
    window.addEventListener("storage", storageEventHandler);
    window.addEventListener("storageLocally", localStorageEventHandler);
    return () => {
      window.removeEventListener("storage", storageEventHandler);
      window.removeEventListener("storageLocally", localStorageEventHandler);
    };
  }, [storageEventHandler, localStorageEventHandler]);

  const setStateWrapper: Dispatch<SetStateAction<T | null>> = useCallback(
    (action) => {
      setState((prevState) => {
        const newValue =
          action instanceof Function ? action(prevState) : action;
        setStoredState(newValue);
        window.dispatchEvent(
          new CustomEvent("storageLocally", { detail: stateKey }),
        );
        return newValue;
      });
    },
    [stateKey, setState, setStoredState],
  );

  return [state, setStateWrapper];
}

export function clearStorage() {
  localStorage.clear();
}

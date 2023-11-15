import React, { useCallback, useEffect, useRef } from "react";

export function Music(props: { src: string; playing: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {
      setTimeout(play, 1000);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (props.playing) {
      play();
    } else {
      pause();
    }
  }, [props.playing, play, pause]);

  return <audio loop ref={audioRef} src={props.src} />;
}

import toast from "react-hot-toast";

import guessCorrectUrl from "../assets/effects/guess_correct.ogg";
import guessOutOfTriesUrl from "../assets/effects/guess_out_of_tries.ogg";
import guessTimeoutUrl from "../assets/effects/guess_timeout.ogg";
import letterCorrectLocationUrl from "../assets/effects/letter_correct_location.ogg";
import letterIncorrectUrl from "../assets/effects/letter_incorrect.ogg";
import letterIncorrectLocationUrl from "../assets/effects/letter_incorrect_location.ogg";
import lingoBallUrl from "../assets/effects/lingo_ball.ogg";

class SoundEffect {
  context: AudioContext;
  buffer: AudioBuffer | undefined;

  constructor(url: string) {
    this.context = new AudioContext();
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((array) => this.context.decodeAudioData(array))
      .then((buffer) => {
        this.buffer = buffer;
        return;
      })
      .catch(toast.error);
  }

  async play() {
    return new Promise((resolve, reject) => {
      if (this.buffer) {
        const source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.onended = resolve;
        source.start();
      } else {
        reject();
      }
    });
  }
}

export const guessCorrect = new SoundEffect(guessCorrectUrl);
export const guessOutOfTries = new SoundEffect(guessOutOfTriesUrl);
export const guessTimeout = new SoundEffect(guessTimeoutUrl);
export const letterCorrectLocation = new SoundEffect(letterCorrectLocationUrl);
export const letterIncorrectLocation = new SoundEffect(
  letterIncorrectLocationUrl,
);
export const letterIncorrect = new SoundEffect(letterIncorrectUrl);
export const lingoBall = new SoundEffect(lingoBallUrl);
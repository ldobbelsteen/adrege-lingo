import guessCorrectUrl from "../assets/effects/guess_correct.ogg";
import guessOutOfTriesUrl from "../assets/effects/guess_out_of_tries.ogg";
import guessTimeoutUrl from "../assets/effects/guess_timeout.ogg";
import letterCorrectLocationUrl from "../assets/effects/letter_correct_location.ogg";
import letterIncorrectUrl from "../assets/effects/letter_incorrect.ogg";
import letterIncorrectLocationUrl from "../assets/effects/letter_incorrect_location.ogg";
import lingoBallUrl from "../assets/effects/lingo_ball.ogg";

class Sound {
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
      .catch((e: unknown) => {
        console.error(e);
      });
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
        reject(new Error("buffer not loaded (yet)"));
      }
    });
  }
}

export const guessCorrect = new Sound(guessCorrectUrl);
export const guessOutOfTries = new Sound(guessOutOfTriesUrl);
export const guessTimeout = new Sound(guessTimeoutUrl);
export const letterCorrectLocation = new Sound(letterCorrectLocationUrl);
export const letterIncorrectLocation = new Sound(letterIncorrectLocationUrl);
export const letterIncorrect = new Sound(letterIncorrectUrl);
export const lingoBall = new Sound(lingoBallUrl);

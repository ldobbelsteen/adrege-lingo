import toast from "react-hot-toast";
import correctAnswerUrl from "./assets/sounds/correct_answer.ogg";
import correctLetterUrl from "./assets/sounds/correct_letter.ogg";
import lingoYellowUrl from "./assets/sounds/lingo_yellow.ogg";
import timeOutUrl from "./assets/sounds/time_out.ogg";
import wrongLetterUrl from "./assets/sounds/wrong_letter.ogg";
import wrongWordUrl from "./assets/sounds/wrong_word.ogg";
import yellowLetterUrl from "./assets/sounds/yellow_letter.ogg";

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

export const correctAnswerSound = new SoundEffect(correctAnswerUrl);
export const correctLetterSound = new SoundEffect(correctLetterUrl);
export const lingoYellowSound = new SoundEffect(lingoYellowUrl);
export const timeOutSound = new SoundEffect(timeOutUrl);
export const wrongLetterSound = new SoundEffect(wrongLetterUrl);
export const wrongWordSound = new SoundEffect(wrongWordUrl);
export const yellowLetterSound = new SoundEffect(yellowLetterUrl);

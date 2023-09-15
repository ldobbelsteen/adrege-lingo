export class SoundEffect {
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
      .catch(console.error);
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

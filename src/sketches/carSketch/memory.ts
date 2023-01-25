import { shuffle } from "lodash";

export class Memory {
  samples: Array<
    [
      Float32Array, // state
      number, // action
      number, // reward
      Float32Array | null // next state
    ]
  >;
  constructor() {
    this.samples = new Array<
      [Float32Array, number, number, Float32Array | null]
    >();
  }

  addSample(sample: [Float32Array, number, number, Float32Array | null]): void {
    this.samples.push(sample);
  }

  normalizeReward(): void {
    let maxReward = -Infinity;
    let minReward = Infinity;
    for (const sample of this.samples) {
      if (sample[2] > maxReward) maxReward = sample[2];
      if (sample[2] < minReward) minReward = sample[2];
    }

    for (let i = 0; i < this.samples.length; ++i) {
      this.samples[i][2] -= minReward;
      this.samples[i][2] /= maxReward - minReward;
    }
  }

  sample(): Array<[Float32Array, number, number, Float32Array | null]> {
    return shuffle(this.samples);
  }

  normalizeAndSample(): Array<
    [Float32Array, number, number, Float32Array | null]
  > {
    this.normalizeReward();
    return this.sample();
  }

  clear(): void {
    this.samples = [];
  }
}

import { sampleSize } from "lodash";

export class Memory {
  maxMemory: number;
  samples: any[];
  constructor(maxMemory: number) {
    this.maxMemory = maxMemory;
    this.samples = new Array<any>();
  }

  addSample(sample: Array<any>): void {
    this.samples.push(sample);
    if (this.samples.length > this.maxMemory) {
      const [state, , , nextState] = this.samples.shift();
      state.dispose();
      nextState.dispose();
    }
  }

  sample(nSamples: number): Array<any> {
    return sampleSize(this.samples, nSamples);
  }
}

import type { p5Interface } from "@/components/SketchComponent.vue";
import { MountainCarEnvironment } from "./mountainCarEnv";

export class CarSketch {
  p5: p5Interface | null;
  mountainCarEnv: MountainCarEnvironment | null;
  constructor() {
    this.p5 = null;
    this.mountainCarEnv = null;
  }

  setup(p5: p5Interface) {
    this.p5 = p5;
    this.mountainCarEnv = new MountainCarEnvironment(p5);
    this.p5.frameRate(60);
  }

  draw() {
    if (!this.p5) return;
    this.mountainCarEnv!.controlKeyboard();
    this.mountainCarEnv!.render();
  }
}

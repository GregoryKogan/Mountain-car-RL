import type { p5Interface } from "@/components/SketchComponent.vue";

export class CarSketch {
  p5: p5Interface | null;
  constructor() {
    this.p5 = null;
  }

  setup(p5: p5Interface) {
    this.p5 = p5;
    console.log("Setup inside TS!");
  }

  draw() {
    if (!this.p5) return;
    console.log("Draw inside TS!");
    this.p5.background(18);
    this.p5.circle(this.p5.width / 2, this.p5.height / 2, 70);
  }
}

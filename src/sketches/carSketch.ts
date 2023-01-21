import type { p5Interface } from "@/components/SketchComponent.vue";

export class CarSketch {
  p5: p5Interface | null;
  posX: number;
  constructor() {
    this.p5 = null;

    this.posX = 0;
  }

  setup(p5: p5Interface) {
    this.p5 = p5;
  }

  draw() {
    if (!this.p5) return;
    this.p5.background("#1a1b26");
    this.posX += this.p5.width / 1000;
    if (this.posX > this.p5.width) this.posX = 0;
    this.p5.circle(this.posX, this.p5.height / 2, this.p5.width / 10);
  }
}

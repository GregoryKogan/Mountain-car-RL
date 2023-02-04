import type { p5Interface } from "@/components/SketchComponent.vue";
import type { Tensor2D } from "@tensorflow/tfjs";
import { tensor2d } from "@tensorflow/tfjs";
import { EnvRenderer } from "./envRenderer";

export class MountainCarEnvironment {
  minPosition: number;
  maxPosition: number;
  maxSpeed: number;
  goalPosition: number;
  carWidth: number;
  carHeight: number;
  position: number;
  velocity: number;
  p5: p5Interface;
  renderer: EnvRenderer;
  constructor(p5: p5Interface) {
    this.p5 = p5;

    this.minPosition = -1.2;
    this.maxPosition = 0.6;
    this.maxSpeed = 0.07;
    this.goalPosition = 0.5;
    this.carWidth = 0.2;
    this.carHeight = 0.1;

    this.position = 0;
    this.velocity = 0;

    this.renderer = new EnvRenderer(p5, this);

    this.setStartingState();
  }

  setStartingState(): void {
    this.position = -0.5;
    this.velocity = 0;
  }

  controlKeyboard(): boolean {
    let action = 0;
    if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) action += 1;
    if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) action -= 1;
    return this.step(action)[2];
  }

  step(action: number): [Tensor2D, number, boolean] {
    const oldPos = this.position;
    const oldVel = this.velocity;

    this.velocity += action * 0.001 - Math.cos(3 * this.position) * 0.0025;
    this.velocity = this.p5.constrain(
      this.velocity,
      -this.maxSpeed,
      this.maxSpeed
    );

    this.position += this.velocity;
    this.position = this.p5.constrain(
      this.position,
      this.minPosition,
      this.maxPosition
    );

    if (this.position == this.minPosition && this.velocity < 0)
      this.velocity = 0;

    return [
      this.getStateTensor(),
      this.computeReward(oldPos, oldVel),
      this.isDone(),
    ];
  }

  computeReward(oldPos: number, oldVel: number): number {
    let reward =
      100 *
      (Math.sin(3 * this.position) * 0.0025 +
        0.5 * this.velocity * this.velocity -
        (Math.sin(3 * oldPos) * 0.0025 + 0.5 * oldVel * oldVel));
    if (this.position >= this.goalPosition) reward += 1;
    console.log(reward);
    return reward;
  }

  isDone(): boolean {
    return this.position >= this.goalPosition;
  }

  getStateTensor(): Tensor2D {
    return tensor2d([[this.position, this.velocity]]);
  }

  render(): void {
    this.renderer.render();
  }
}

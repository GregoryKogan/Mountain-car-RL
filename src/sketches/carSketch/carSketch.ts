import type { p5Interface } from "@/components/SketchComponent.vue";
import { Memory } from "./memory";
import { Model } from "./model";
import { MountainCarEnvironment } from "./mountainCarEnv";
import { Orchestrator } from "./orchestrator";

export class CarSketch {
  p5: p5Interface | null;
  mountainCarEnv: MountainCarEnvironment | null;
  model: Model | null;
  memory: Memory | null;
  orchestrator: Orchestrator | null;
  constructor() {
    this.p5 = null;
    this.mountainCarEnv = null;
    this.model = null;
    this.memory = null;
    this.orchestrator = null;
  }

  setup(p5: p5Interface) {
    this.p5 = p5;
    this.mountainCarEnv = new MountainCarEnvironment(p5);
    this.model = new Model(100);
    this.memory = new Memory(500);
    this.orchestrator = new Orchestrator(
      this.mountainCarEnv,
      this.model,
      this.memory,
      0.95,
      500
    );

    console.log("Training!");
    this.train();
  }

  async train() {
    if (!this.orchestrator) throw new Error("Orchestrator is not initialized!");
    await this.orchestrator.play();

    console.log(
      "Max position: ",
      this.orchestrator.maxPositionStore[
        this.orchestrator.maxPositionStore.length - 1
      ]
    );
    console.log(
      "Max reward: ",
      this.orchestrator.rewardStore[this.orchestrator.rewardStore.length - 1]
    );
  }

  draw() {
    // if (!this.p5) return;
    // this.mountainCarEnv!.controlKeyboard();
    // this.mountainCarEnv!.render();
  }
}

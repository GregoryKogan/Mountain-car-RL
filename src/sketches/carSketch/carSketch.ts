import type { p5Interface } from "@/components/SketchComponent.vue";
import { Memory } from "./memory";
import { Model } from "./model";
import { MountainCarEnvironment } from "./mountainCarEnv";
import { Orchestrator } from "./orchestrator";
import * as tf from "@tensorflow/tfjs";

export class CarSketch {
  p5: p5Interface | null;
  mountainCarEnv: MountainCarEnvironment | null;
  model: Model | null;
  memory: Memory | null;
  orchestrator: Orchestrator | null;
  status: string;
  gameCounter: number;
  constructor() {
    this.p5 = null;
    this.mountainCarEnv = null;
    this.model = null;
    this.memory = null;
    this.orchestrator = null;

    this.status = "Loading";
    this.gameCounter = 0;
  }

  setup(p5: p5Interface) {
    this.p5 = p5;
    this.mountainCarEnv = new MountainCarEnvironment(p5);
    this.model = new Model(
      [16, 8], // hidden layers
      null // learning rate
    );
    this.memory = new Memory();
    this.orchestrator = new Orchestrator(
      this.mountainCarEnv,
      this.model,
      this.memory,
      0.999, // discount rate (how much further actions affect current Q-value)
      500, // max steps per game
      true, // enable rendering
      0.01, // minimum epsilon (exploration coefficient)
      1, // maximum epsilon (exploration coefficient)
      0.0001 // lambda (decay speed of epsilon)
    );

    console.log("Training!");
    this.train();
  }

  async train() {
    if (!this.orchestrator) throw new Error("Orchestrator is not initialized!");

    // eslint-disable-next-line no-constant-condition
    while (true) {
      tf.engine().startScope();
      this.status = "Playing";
      for (let i = 0; i < 10; i++) {
        this.gameCounter++;
        this.orchestrator.renderWhileTraining = i == 0 ? true : false;
        await new Promise((r) => setTimeout(r, 100));
        await this.orchestrator.play();
      }
      this.status = "Learning";
      await new Promise((r) => setTimeout(r, 100));
      await this.orchestrator.learnFromExperience();
      tf.engine().endScope();

      console.log("Tensors: ", tf.memory().numTensors);
      console.log("Epsilon", this.orchestrator.eps);
      console.log(
        "Max position: ",
        this.orchestrator.maxPositionStore[
          this.orchestrator.maxPositionStore.length - 1
        ]
      );
      console.log(
        "Total reward: ",
        this.orchestrator.rewardStore[this.orchestrator.rewardStore.length - 1]
      );
    }
  }

  draw() {
    // if (!this.p5) return;
    // this.mountainCarEnv!.controlKeyboard();
    // this.mountainCarEnv!.render();
  }
}

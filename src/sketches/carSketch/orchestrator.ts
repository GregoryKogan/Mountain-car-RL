import type { MountainCarEnvironment } from "./mountainCarEnv";
import type { Model } from "./model";
import type { Memory } from "./memory";

import * as tf from "@tensorflow/tfjs";
import { toRaw } from "vue";

export class Orchestrator {
  mountainCarEnv: MountainCarEnvironment;
  model: Model;
  memory: Memory;
  minEpsilon: number;
  maxEpsilon: number;
  lambda: number;
  eps: any;
  maxStepsPerGame: number;
  discountRate: number;
  rewardStore: any[];
  maxPositionStore: any[];
  renderWhileTraining: boolean;
  totalSteps: number;
  constructor(
    mountainCarEnv: MountainCarEnvironment,
    model: Model,
    memory: Memory,
    discountRate: number,
    maxStepsPerGame: number,
    renderWhileTraining: boolean = true,
    minEpsilon: number = 0.01,
    maxEpsilon: number = 1,
    lambda: number = 0.00005
  ) {
    // The main components of the environment
    this.mountainCarEnv = mountainCarEnv;
    this.model = model;
    this.memory = memory;

    this.renderWhileTraining = renderWhileTraining;

    this.minEpsilon = minEpsilon;
    this.maxEpsilon = maxEpsilon;
    this.lambda = lambda;

    // The exploration parameter
    this.eps = this.maxEpsilon;

    // Keep tracking of the elapsed steps
    this.totalSteps = 0;
    this.maxStepsPerGame = maxStepsPerGame;

    this.discountRate = discountRate;

    // Initialization of the rewards and max positions containers
    this.rewardStore = new Array();
    this.maxPositionStore = new Array();
  }

  computeReward(
    position: number,
    velocity: number
    // nextVelocity: number
  ): number {
    if (position >= 0.5) return 1000;
    // return 300 * Math.abs(Math.abs(nextVelocity) - Math.abs(velocity));

    // if (position >= 0.3) return 40;
    // if (position >= 0.1) return 20;
    // if (position >= -0.1) return 10;
    // if (position >= -0.3) return 5;
    // if (position >= -0.5) return 1;
    // else return 0;

    const kineticEnergy = (90 * velocity) ** 2 / 2;
    const height = Math.sin(3 * position) + 1;
    const potentialEnergy = 10 * height;
    return (kineticEnergy + potentialEnergy) / 40;
  }

  async play() {
    this.mountainCarEnv.setStartingState();
    let state: tf.Tensor2D | null = this.mountainCarEnv.getStateTensor();
    let totalReward = 0;
    let maxPosition = -100; // Obviously less than any possible position
    let currentStep = 0;
    let done = false;

    while (currentStep < this.maxStepsPerGame && !done) {
      // render current environment state if rendering is opted
      if (this.renderWhileTraining) {
        this.mountainCarEnv.render();
        await tf.nextFrame();
      }

      // Act!
      const action = this.model.chooseAction(state!, this.eps);
      // const prevVelocity = this.mountainCarEnv.velocity;
      done = this.mountainCarEnv.update(action);
      const reward = this.computeReward(
        this.mountainCarEnv.position,
        // prevVelocity
        this.mountainCarEnv.velocity
      );

      let nextState: tf.Tensor2D | null = this.mountainCarEnv.getStateTensor();

      // Keep the car on max position if reached
      // Remembering best car position in current environment
      if (this.mountainCarEnv.position > maxPosition)
        maxPosition = this.mountainCarEnv.position;
      if (done) nextState = null;

      // Adding to memory information about starting state, action,
      // and outcome of that action for future learning
      this.memory.addSample([
        state!.dataSync(),
        action,
        reward,
        nextState!.dataSync(),
      ]);

      this.totalSteps++;
      // Exponentially decay the exploration parameter
      this.eps =
        this.minEpsilon +
        (this.maxEpsilon - this.minEpsilon) *
          Math.exp(-this.lambda * this.totalSteps);

      state = nextState;
      totalReward += reward;
      currentStep++;
    }

    // Keep track of the max position reached and store the total reward
    this.rewardStore.push(totalReward);
    this.maxPositionStore.push(maxPosition);
  }

  async learnFromExperience() {
    // Sample from memory
    let batch = this.memory.sample(this.model.batchSize);
    batch = batch.map(([state, action, reward, nextState]) => [
      tf.tensor2d([[state[0], state[1]]]),
      action,
      reward,
      nextState ? tf.tensor2d([[nextState[0], nextState[1]]]) : null,
    ]);
    const states = batch.map(([state, , ,]) => state);
    const nextStates = batch.map(([, , , nextState]) =>
      nextState ? nextState : tf.zeros([this.model.numStates])
    );

    // Predict the values of each action at each state
    const actionsValues = states.map((state) => this.model.predict(state));
    // Predict the values of each action at each next state
    const nextActionsValues = nextStates.map((nextState) =>
      this.model.predict(nextState)
    );

    const x = new Array();
    const y = new Array();

    // Update the states rewards with the discounted next states rewards
    batch.forEach(
      ([state, action, reward, nextState]: [any, number, any, any], index) => {
        const currentQ: any = actionsValues[index];
        const nextQ: any = nextActionsValues[index];

        currentQ[action] = reward;
        if (nextState)
          currentQ[action] += this.discountRate * nextQ.max().dataSync();

        x.push(toRaw(state).dataSync());
        y.push(toRaw(currentQ).dataSync());
      }
    );

    // Clean unused tensors
    actionsValues.forEach((state: any) => tf.dispose(state));
    nextActionsValues.forEach((state: any) => tf.dispose(state));

    // Reshape the batches to be fed to the network
    const xTensor: any = tf.tensor2d(x, [x.length, this.model.numStates]);
    const yTensor: any = tf.tensor2d(y, [y.length, this.model.numActions]);

    // Learn the Q(s, a) values given associated discounted rewards
    await this.model.train(xTensor, yTensor);

    tf.dispose(xTensor);
    tf.dispose(yTensor);
  }
}

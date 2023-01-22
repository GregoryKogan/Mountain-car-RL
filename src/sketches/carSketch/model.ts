import * as tf from "@tensorflow/tfjs";
import { toRaw } from "vue";

export class Model {
  numStates: number;
  numActions: number;
  batchSize: number;
  hiddenLayerSizes: number[];
  network: tf.LayersModel | null;
  learningRate: number;
  constructor(
    batchSize: number,
    hiddenLayerSizes: number[],
    learningRate: number,
    trainedModel: tf.LayersModel | null = null
  ) {
    this.numStates = 2;
    this.numActions = 3;
    this.hiddenLayerSizes = hiddenLayerSizes;
    this.learningRate = learningRate;
    this.batchSize = batchSize;
    this.network = null;

    if (trainedModel) {
      this.network = trainedModel;
      this.network.summary();
      const optimizer = tf.train.adam(this.learningRate);
      this.network.compile({ optimizer: optimizer, loss: "meanSquaredError" });
    } else {
      this.defineModel();
    }
  }

  defineModel(): void {
    const newNetwork = tf.sequential();
    this.hiddenLayerSizes.forEach((hiddenLayerSize, i) => {
      newNetwork.add(
        tf.layers.dense({
          units: hiddenLayerSize,
          kernelInitializer: "varianceScaling",
          activation: "relu",
          // `inputShape` is required only for the first layer.
          inputShape: i == 0 ? [this.numStates] : undefined,
        })
      );
    });
    newNetwork.add(
      tf.layers.dense({
        units: this.numActions,
        kernelInitializer: "varianceScaling",
        activation: "relu",
      })
    );

    this.network = newNetwork;
    this.network.summary();
    const optimizer = tf.train.adam(this.learningRate);
    this.network.compile({
      optimizer: optimizer,
      loss: "meanSquaredError",
    });
  }

  predict(
    state: tf.Tensor | tf.Tensor[]
  ): tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[] {
    if (!toRaw(this.network)) throw new Error("Network is not initialized!");
    const rawNetwork = toRaw(this.network!);
    const rawState = toRaw(state);
    return tf.tidy(() => rawNetwork.predict(rawState));
  }

  async train(xBatch: tf.Tensor[], yBatch: tf.Tensor[]): Promise<void> {
    if (!this.network) throw new Error("Network is not initialized!");
    await toRaw(this.network!).fit(xBatch, yBatch);
  }

  chooseAction(state: tf.Tensor, eps: number): number {
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions) - 1;
    } else {
      const prediction: any = this.predict(state);
      const action = prediction.argMax(1).dataSync()[0];
      return action - 1;
    }
  }
}

import * as tf from "@tensorflow/tfjs";

export class Model {
  numStates: number;
  numActions: number;
  batchSize: number;
  hiddenLayerSizes: number[];
  network: any;
  constructor(batchSize: number, trainedModel: tf.Sequential | null = null) {
    this.numStates = 2;
    this.numActions = 3;
    this.hiddenLayerSizes = [50, 30, 20, 10];
    this.batchSize = batchSize;
    this.network = null;

    if (trainedModel) {
      this.network = trainedModel;
      this.network.summary();
      this.network.compile({ optimizer: "adam", loss: "meanSquaredError" });
    } else {
      this.defineModel();
    }
  }

  defineModel(): void {
    this.network = tf.sequential();
    this.hiddenLayerSizes.forEach((hiddenLayerSize, i) => {
      this.network.add(
        tf.layers.dense({
          units: hiddenLayerSize,
          kernelInitializer: "varianceScaling",
          activation:
            i == this.hiddenLayerSizes.length - 1 ? "softmax" : "relu",
          // `inputShape` is required only for the first layer.
          inputShape: i == 0 ? [this.numStates] : undefined,
        })
      );
    });
    this.network.add(tf.layers.dense({ units: this.numActions }));

    this.network.summary();
    this.network.compile({ optimizer: "adam", loss: "meanSquaredError" });
  }

  predict(
    states: tf.Tensor | tf.Tensor[]
  ): tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[] {
    return tf.tidy(() => this.network.predict(states));
  }

  async train(xBatch: tf.Tensor[], yBatch: tf.Tensor[]): Promise<void> {
    await this.network.fit(xBatch, yBatch);
  }

  chooseAction(state: tf.Tensor, eps: number) {
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions) - 1;
    } else {
      return tf.tidy(() => {
        const prediction = this.network.predict(state).argMax(-1).dataSync()[0];
        console.log(prediction - 1);
        return prediction - 1;
      });
    }
  }
}

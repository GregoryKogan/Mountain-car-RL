<template>
  <h1>Mountain Car Problem - Reinforcement Learning</h1>
  <br />
  <div class="sketch-wrapper">
    <sketch-component
      sketch-name="car-sketch"
      :sketch="carSketch"
      :aspect-ratio="16 / 9"
    />
  </div>
  <!-- <br />
  <div class="sketch-data">
    <line-chart
      title="Total reward"
      x-title="Games"
      y-title="Reward"
      :labels="
        carSketch.orchestrator
          ? Array.from(
              { length: carSketch.orchestrator.rewardStore.length },
              (_, i) => (i + 1).toString()
            )
          : []
      "
      :values="
        carSketch.orchestrator ? [...carSketch.orchestrator.rewardStore] : []
      "
    />
    <h3>Game №: {{ gameCounter }}</h3>
    <h3>Status: {{ status }}</h3>
    <h3>Last action: {{ lastAction }}</h3>
    <h3>Steps: {{ steps }}</h3>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SketchComponent from "@/components/SketchComponent.vue";
import { CarSketch } from "@/sketches/carSketch/carSketch";
import LineChart from "@/components/LineChart.vue";

export default defineComponent({
  name: "HomeView",
  components: { SketchComponent, LineChart },
  data: () => ({
    carSketch: new CarSketch(),
  }),
  // computed: {
  //   steps(): number {
  //     if (!this.carSketch.orchestrator) return 0;
  //     return this.carSketch.orchestrator.totalSteps;
  //   },
  //   lastAction(): string {
  //     if (
  //       !this.carSketch.orchestrator ||
  //       !this.carSketch.orchestrator.memory.samples[
  //         this.carSketch.orchestrator.memory.samples.length - 1
  //       ]
  //     )
  //       return "Nothing";
  //     const action =
  //       this.carSketch.orchestrator.memory.samples[
  //         this.carSketch.orchestrator.memory.samples.length - 1
  //       ][1];
  //     if (action == -1) return "Left";
  //     if (action == 1) return "Right";
  //     return "Nothing";
  //   },
  //   gameCounter(): number {
  //     return this.carSketch.gameCounter;
  //   },
  //   status(): string {
  //     return this.carSketch.status;
  //   },
  //   totalRewardChartLabels(): string[] {
  //     if (!this.carSketch.orchestrator) return [];
  //     return Array.from(
  //       { length: this.carSketch.orchestrator.rewardStore.length },
  //       (_, i) => (i + 1).toString()
  //     );
  //   },
  // },
});
</script>

<style scoped>
.sketch-wrapper {
  margin: auto;
  max-width: 100vh;
  isolation: isolate;
  border: 2px solid;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 18px 18px 46px #14151e, -18px -18px 46px #20212e, 0 0 10px #c0caf5;
}

.sketch-data {
  margin: auto;
  max-width: 100vh;
}
</style>

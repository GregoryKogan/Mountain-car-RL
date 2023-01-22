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
  <div class="sketch-data">
    <br />
    <input
      type="checkbox"
      id="checkbox"
      v-model="rendering"
      @change="checkRendering"
    />
    <label for="checkbox">{{ rendering ? "Rendering" : "No rendering" }}</label>
    <h3>Game №: {{ gameCounter }}</h3>
    <h3>Status: {{ status }}</h3>
    <h3>Last action: {{ lastAction }}</h3>
    <h3>Steps: {{ steps }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SketchComponent from "@/components/SketchComponent.vue";
import { CarSketch } from "@/sketches/carSketch/carSketch";

export default defineComponent({
  name: "HomeView",
  components: { SketchComponent },
  data: () => ({
    carSketch: new CarSketch(),
  }),
  computed: {
    steps(): number {
      if (!this.carSketch.orchestrator) return 0;
      return this.carSketch.orchestrator.totalSteps;
    },
    lastAction(): string {
      if (
        !this.carSketch.orchestrator ||
        !this.carSketch.orchestrator.memory.samples[
          this.carSketch.orchestrator.memory.samples.length - 1
        ]
      )
        return "Nothing";
      const action =
        this.carSketch.orchestrator.memory.samples[
          this.carSketch.orchestrator.memory.samples.length - 1
        ][1];
      if (action == -1) return "Left";
      if (action == 1) return "Right";
      return "Nothing";
    },
    gameCounter(): number {
      return this.carSketch.gameCounter;
    },
    status(): string {
      return this.carSketch.status;
    },
    rendering(): boolean {
      if (!this.carSketch.orchestrator) return false;
      return this.carSketch.orchestrator.renderWhileTraining;
    },
  },
  methods: {
    checkRendering() {
      if (!this.carSketch.orchestrator) return 0;
      this.carSketch.orchestrator.renderWhileTraining =
        !this.carSketch.orchestrator.renderWhileTraining;
    },
  },
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

<template>
  <h1>Mountain Car Problem - Reinforcement Learning</h1>
  <div class="sketch-wrapper">
    <sketch-component
      sketch-name="car-sketch"
      :sketch="carSketch"
      :aspect-ratio="16 / 9"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SketchComponent from "@/components/SketchComponent.vue";
import { CarSketch } from "@/sketches/carSketch";

export default defineComponent({
  name: "HomeView",
  data: () => ({
    carSketch: new CarSketch(),
  }),
  components: { SketchComponent },
});
</script>

<style scoped>
.sketch-wrapper {
  border: 2px solid;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 18px 18px 46px #14151e, -18px -18px 46px #20212e, 0 0 10px #c0caf5;
}
</style>

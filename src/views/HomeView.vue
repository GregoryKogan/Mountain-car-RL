<template>
  <h1>Hello, world!</h1>
  <div style="padding: 20px; background-color: #f6ca09">
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

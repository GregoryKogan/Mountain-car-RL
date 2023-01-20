<template>
  <div :id="sketchName"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { p5 } from "p5js-wrapper";

export interface p5Interface {
  setup: any;
  createCanvas: any;
  windowResized: any;
  resizeCanvas: any;
  draw: any;
  background: any;
  circle: (arg0: number, arg1: number, arg2: number) => void;
  width: number;
  height: number;
}

export interface sketchInterface {
  setup: () => void;
  draw: () => void;
}

export default defineComponent({
  name: "SketchComponent",
  props: {
    sketchName: String,
    sketch: Object,
    aspectRatio: Number,
  },
  mounted() {
    const sketchName = this.sketchName;
    const sizeSketch = this.sizeSketch;
    const getParentDiv = this.getParentDiv;
    const sketch = this.sketch;
    new p5((p: p5Interface) => {
      p.setup = () => {
        const parentDiv = getParentDiv();
        if (!parentDiv) return;
        sizeSketch(parentDiv);
        let canvas = p.createCanvas(
          parentDiv.clientWidth,
          parentDiv.clientHeight
        );
        canvas.style("display", "block");
        if (sketch) sketch.setup(p);
      };

      p.windowResized = function () {
        const parentDiv = getParentDiv();
        if (!parentDiv) return;
        sizeSketch(parentDiv);
        p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
      };

      p.draw = () => {
        if (sketch) sketch.draw();
      };
    }, sketchName);
  },
  methods: {
    sizeSketch(parentDiv: HTMLElement): void {
      const aspectRatio = this.aspectRatio ? 1 / this.aspectRatio : 9 / 16;
      parentDiv.setAttribute(
        "style",
        "height:" + parentDiv.clientWidth * aspectRatio + "px"
      );
    },

    getParentDiv(): HTMLElement | null {
      if (!this.sketchName) return null;
      const parentDiv = document.getElementById(this.sketchName);
      if (!parentDiv) console.error("No parent div found!");
      return parentDiv;
    },
  },
});
</script>

<style scoped>
#sketch-container {
  width: 100%;
}
</style>

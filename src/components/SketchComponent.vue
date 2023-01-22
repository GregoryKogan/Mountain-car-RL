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
  line: (arg0: number, arg1: number, arg2: number, arg3: number) => void;
  rect: (
    arg0: number,
    arg1: number,
    arg2: number,
    arg3: number,
    arg4: number | null
  ) => void;
  triangle: (
    arg0: number,
    arg1: number,
    arg2: number,
    arg3: number,
    arg4: number,
    arg5: number
  ) => void;
  map: (
    arg0: number,
    arg1: number,
    arg2: number,
    arg3: number,
    arg4: number
  ) => number;
  stroke: (arg0: string) => void;
  noStroke: () => void;
  push: () => void;
  pop: () => void;
  fill: (arg0: string) => void;
  strokeWeight: (arg0: number) => void;
  rotate: (arg0: number) => void;
  translate: (arg0: number, arg1: number) => void;
  frameRate: (arg0: number) => void;
  keyIsDown: (arg0: number) => boolean;
  constrain: (arg0: number, arg1: number, arg2: number) => number;
  width: number;
  height: number;
  LEFT_ARROW: number;
  RIGHT_ARROW: number;
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

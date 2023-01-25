<template>
  <LineChartElement :options="chartOptions" :data="chartData" />
</template>

<script lang="ts">
import { Line as LineChartElement } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

export default {
  name: "LineChart",
  components: { LineChartElement },
  props: {
    title: { type: String, required: true },
    xTitle: { type: String, required: true },
    yTitle: { type: String, required: true },
    labels: { type: Array<String>, required: true },
    values: { type: Array<Number>, required: true },
  },
  computed: {
    chartData(): { labels: String[]; datasets: Array<{ data: number[] }> } {
      return {
        labels: this.labels,
        datasets: [{ data: this.values as number[] }],
      };
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        borderColor: "#2ac3de",
        cubicInterpolationMode: "monotone",
        plugins: {
          title: { display: true, text: this.title, color: "#c0caf5" },
        },
        scales: {
          x: {
            grid: { color: "#565f89" },
            ticks: { color: "#c0caf5" },
            title: { display: true, text: this.xTitle, color: "#c0caf5" },
          },
          y: {
            grid: { color: "#565f89" },
            ticks: { color: "#c0caf5" },
            title: { display: true, text: this.yTitle, color: "#c0caf5" },
          },
        },
      },
    };
  },
};
</script>

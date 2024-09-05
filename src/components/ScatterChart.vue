<template>
  <Scatter :data="chartData" :options="chartOptions" />
</template>

<script>
import { Scatter } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale);

export default {
  name: 'ScatterChart',
  components: {
    Scatter,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Add any styles specific to your chart component */
</style>

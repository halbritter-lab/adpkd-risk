<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ScatterController,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    chartData: Object,
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      const ctx = canvas.value.getContext('2d');
      chartInstance = new ChartJS(ctx, {
        type: 'scatter', // Set chart type to scatter
        data: props.chartData,
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: 20,
              max: 80,
            },
            y: {
              beginAtZero: true,
              max: 20000,
            },
          },
        },
      });
    };

    // Watch for changes in the chartData prop and update the chart
    watch(
      () => props.chartData,
      (newData) => {
        if (chartInstance) {
          chartInstance.data = newData;
          chartInstance.update();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      createChart();
    });

    return {
      canvas,
    };
  },
};
</script>

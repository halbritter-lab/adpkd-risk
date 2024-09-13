<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  LineElement,
  LinearScale,
  LogarithmicScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import chartConfig from '../config/chartConfig.js';

ChartJS.register(
  ScatterController,
  PointElement,
  LineElement,
  LinearScale,
  LogarithmicScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
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
        type: 'scatter',
        data: {
          ...props.chartData,
          datasets: [...props.chartData.datasets, ...chartConfig.lineChart.classificationData],
        },
        options: chartConfig.lineChart.options,
      });
    };

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    watch(
      () => props.chartData,
      (newData) => {
        if (chartInstance) {
          chartInstance.data = {
            ...newData,
            datasets: [...newData.datasets, ...chartConfig.lineChart.classificationData],
          };
          chartInstance.update();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      createChart();
      window.addEventListener('resize', resizeChart);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart);
    });

    return {
      canvas,
    };
  },
};
</script>

<style>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px; /* Set a default height */
}
</style>

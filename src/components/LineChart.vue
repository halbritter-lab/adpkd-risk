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
  Filler, // Import the Filler plugin
} from 'chart.js';

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
  Filler // Register the Filler plugin
);

export default {
  props: {
    chartData: Object,
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Class line data extracted from Mayo classification chart with fill colors for each section
    const classificationData = [
      {
        label: 'Class 1A',
        data: [{ x: 15, y: 187.535 }, { x: 80, y: 493.599 }],
        borderColor: '#00b050',
        backgroundColor: 'rgba(0, 176, 80, 0.2)',
        borderWidth: 2,
        fill: 'origin',
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1B',
        data: [{ x: 15, y: 233.695 }, { x: 80, y: 1596.134 }],
        borderColor: '#ccff99',
        backgroundColor: 'rgba(204, 255, 153, 0.2)',
        borderWidth: 2,
        fill: '-1',
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1C',
        data: [{ x: 15, y: 290.292 }, { x: 80, y: 5074.514 }],
        borderColor: '#ffc000',
        backgroundColor: 'rgba(255, 192, 0, 0.2)',
        borderWidth: 2,
        fill: '-1',
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1D',
        data: [{ x: 15, y: 359.484 }, { x: 80, y: 15869.399 }],
        borderColor: '#ff6600',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',
        borderWidth: 2,
        fill: '-1',
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1E',
        data: [{ x: 15, y: 100 }, { x: 80, y: 100 }],
        borderColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        fill: '-1',
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
    ];

    const createChart = () => {
      const ctx = canvas.value.getContext('2d');
      chartInstance = new ChartJS(ctx, {
        type: 'scatter',
        data: {
          ...props.chartData,
          datasets: [...props.chartData.datasets, ...classificationData],
        },
        options: {
          responsive: true, // Make the chart responsive
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: 20,
              max: 80,
              title: {
                display: true,
                text: 'Patient Age (Years)',
              },
            },
            y: {
              type: 'logarithmic',
              min: 100,
              max: 20000,
              title: {
                display: true,
                text: 'HtTKV (mL/m)',
              },
              ticks: {
                callback: function (value) {
                  return value;
                },
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const point = context.raw;
                  return `Patient ID: ${point.patientId}, Age: ${point.x}, Volume: ${point.y}`;
                },
              },
              mode: 'nearest',
              intersect: true,
            },
          },
        },
      });
    };

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize(); // Ensure chart resizes dynamically
      }
    };

    // Watch for changes in chartData
    watch(
      () => props.chartData,
      (newData) => {
        if (chartInstance) {
          chartInstance.data = {
            ...newData,
            datasets: [...newData.datasets, ...classificationData],
          };
          chartInstance.update();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      createChart();
      window.addEventListener('resize', resizeChart); // Add listener for window resize
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart); // Remove listener when component unmounts
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

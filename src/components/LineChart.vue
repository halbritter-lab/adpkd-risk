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
  LineElement,
  LinearScale,
  LogarithmicScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
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
  Legend
);

export default {
  props: {
    chartData: Object,
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Class line data extracted from Mayo classification chart
    const classificationData = [
      {
        label: 'Class 1A',
        data: [
          { x: 15, y: 187.535 }, { x: 80, y: 493.599 }
        ],
        borderColor: '#00b050',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'Class 1B',
        data: [
          { x: 15, y: 233.695 }, { x: 80, y: 1596.134 }
        ],
        borderColor: '#ccff99',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'Class 1C',
        data: [
          { x: 15, y: 290.292 }, { x: 80, y: 5074.514 }
        ],
        borderColor: '#ffc000',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'Class 1D',
        data: [
          { x: 15, y: 359.484 }, { x: 80, y: 15869.399 }
        ],
        borderColor: '#ff6600',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'Class 1E',
        data: [
          { x: 15, y: 100 }, { x: 80, y: 100 }
        ],
        borderColor: 'black',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
    ];

    const createChart = () => {
      const ctx = canvas.value.getContext('2d');
      chartInstance = new ChartJS(ctx, {
        type: 'scatter',
        data: {
          ...props.chartData,
          datasets: [
            ...props.chartData.datasets,
            ...classificationData, // Adding the classification lines to the chart
          ],
        },
        options: {
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
              type: 'logarithmic', // Set Y-axis to logarithmic
              min: 100,
              max: 20000,
              title: {
                display: true,
                text: 'HtTKV (mL/m)',
              },
              ticks: {
                callback: function (value) {
                  return value; // Format the ticks properly
                },
              },
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
          chartInstance.data = {
            ...newData,
            datasets: [...newData.datasets, ...classificationData], // Re-apply the classification lines
          };
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

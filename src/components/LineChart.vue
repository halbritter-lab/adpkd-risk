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
        data: [
          { x: 15, y: 187.535 }, { x: 80, y: 493.599 }
        ],
        borderColor: '#00b050',
        backgroundColor: 'rgba(0, 176, 80, 0.2)',  // Adding semi-transparent background color for the fill
        borderWidth: 2,
        fill: 'origin', // Fill the area below the line
        showLine: true,
        pointRadius: 0, // Disable points on the classification lines
        hoverRadius: 0, // Disable hover effect on classification lines
      },
      {
        label: 'Class 1B',
        data: [
          { x: 15, y: 233.695 }, { x: 80, y: 1596.134 }
        ],
        borderColor: '#ccff99',
        backgroundColor: 'rgba(204, 255, 153, 0.2)',  // Semi-transparent yellow-green
        borderWidth: 2,
        fill: '-1', // Fill the area between this line and the previous line (Class 1A)
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1C',
        data: [
          { x: 15, y: 290.292 }, { x: 80, y: 5074.514 }
        ],
        borderColor: '#ffc000',
        backgroundColor: 'rgba(255, 192, 0, 0.2)',  // Semi-transparent yellow
        borderWidth: 2,
        fill: '-1', // Fill the area between this line and the previous line (Class 1B)
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1D',
        data: [
          { x: 15, y: 359.484 }, { x: 80, y: 15869.399 }
        ],
        borderColor: '#ff6600',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',  // Semi-transparent orange
        borderWidth: 2,
        fill: '-1', // Fill the area between this line and the previous line (Class 1C)
        showLine: true,
        pointRadius: 0,
        hoverRadius: 0,
      },
      {
        label: 'Class 1E',
        data: [
          { x: 15, y: 100 }, { x: 80, y: 100 }
        ],
        borderColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Semi-transparent black
        borderWidth: 2,
        fill: '-1', // Fill the area between this line and the previous line (Class 1D)
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
        datasets: [
            ...props.chartData.datasets,
            ...classificationData, // Adding the classification lines and background colors
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
            filter: (tooltipItem) => {
                // Only show tooltips for points, not for lines/areas
                return tooltipItem.datasetIndex < props.chartData.datasets.length;
            },
            },
            filler: {
            propagate: true, // Enable filler for the chart
            },
        },
        interaction: {
            mode: 'nearest',
            intersect: true, // Only interact with points, not the entire area
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
            datasets: [...newData.datasets, ...classificationData], // Re-apply the classification lines and fills
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

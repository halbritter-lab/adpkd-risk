<template>
  <div style="position: relative;" class="chart-container">
    <canvas ref="canvas"></canvas>
    <!-- Download button in the top-right corner -->
    <v-btn
      small
      density="compact"
      icon
      color="primary"
      style="position: absolute; top: 0px; right: 0px; z-index: 5;"
      @click="downloadChart"
      aria-label="Download Chart as PNG"
    >
      <v-icon>mdi-download</v-icon>
      <v-tooltip activator="parent" location="bottom">
        Download Chart
      </v-tooltip>
    </v-btn>
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
  Tooltip,
  Legend,
  Filler
);

export default {
  props: {
    chartData: Object,
    propkdRiskLevel: String, // Add a prop for PROPKD risk level (low or high)
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Function to create the chart
    const createChart = () => {
      const ctx = canvas.value.getContext('2d');

      // Default to the 'default' scheme if propkdRiskLevel is not 'lowRisk' or 'highRisk'
      const riskScheme = chartConfig.lineChart.propkdRiskSchemes[props.propkdRiskLevel] || chartConfig.lineChart.propkdRiskSchemes.default;

      // Update the classification data with the appropriate color scheme
      const classificationData = chartConfig.lineChart.classificationData.map((classData) => {
        const classKey = classData.label.split(' ')[1]; // e.g., "Class 1A" -> "1A"
        return {
          ...classData,
          backgroundColor: riskScheme[`class${classKey}`]?.backgroundColor || classData.backgroundColor,
          borderColor: riskScheme[`class${classKey}`]?.borderColor || classData.borderColor,
        };
      });

      // Initialize the chart
      chartInstance = new ChartJS(ctx, {
        type: 'scatter',
        data: {
          ...props.chartData,
          datasets: [...props.chartData.datasets, ...classificationData],
        },
        options: chartConfig.lineChart.options,
      });
    };

    // Function to destroy the chart
    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };

    // Function to download the chart as PNG
    const downloadChart = () => {
      if (canvas.value) {
        const link = document.createElement('a');
        link.href = canvas.value.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
      }
    };

    // Watch for changes to propkdRiskLevel to update the chart
    watch(
      () => props.propkdRiskLevel,
      (newRiskLevel) => {
        destroyChart(); // Destroy the existing chart instance
        createChart(); // Recreate the chart with the updated risk level
      }
    );

    // Watch for changes in chartData to update the chart data
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

    // Create chart on mount
    onMounted(() => {
      createChart();
    });

    // Return the necessary refs and functions
    return {
      canvas,
      downloadChart,
    };
  },
};
</script>

<style>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>

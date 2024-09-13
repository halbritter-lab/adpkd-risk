<template>
  <div style="position: relative;">
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart as ChartJS, ScatterController, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import chartConfig from '../config/chartConfig.js'; // Import chartConfig.js

ChartJS.register(ScatterController, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default {
  props: {
    mayoClass: {
      type: String,
      default: 'class1A', // Default Mayo Class
    },
    propkdScore: {
      type: Number,
      default: 0, // Default PROPKD Score
    },
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Mapping Mayo class to risk categories using chartConfig
    const mayoClassToRisk = (mayoClass) => chartConfig.mayoVsPropkdChart.mayoClassMap[mayoClass] || 'low';

    // Mapping PROPKD score to risk categories
    const propkdToRisk = (propkdScore) => {
      if (propkdScore >= chartConfig.mayoVsPropkdChart.propkdScoreMap.low[0] && propkdScore <= chartConfig.mayoVsPropkdChart.propkdScoreMap.low[1]) {
        return 'low';
      }
      if (propkdScore >= chartConfig.mayoVsPropkdChart.propkdScoreMap.intermediate[0] && propkdScore <= chartConfig.mayoVsPropkdChart.propkdScoreMap.intermediate[1]) {
        return 'intermediate';
      }
      return 'high';
    };

    // Get coordinates based on Mayo and PROPKD risks
    const getPatientCoords = (mayoRisk, propkdRisk) => {
      const xMap = { low: 1, intermediate: 2, high: 3 };
      const yMap = { low: 1, intermediate: 2, high: 3 };
      return { x: xMap[mayoRisk], y: yMap[propkdRisk] };
    };

    // Background color plugin for the grid
    const backgroundPlugin = {
      id: 'backgroundPlugin',
      beforeDraw: (chart) => {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();

        const colors = chartConfig.mayoVsPropkdChart.riskColors;

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            ctx.fillStyle = colors[i][j];
            ctx.fillRect(
              x.getPixelForValue(j + 1) - (x.width / 6),
              y.getPixelForValue(i + 1) - (y.height / 6),
              x.width / 3,
              y.height / 3
            );
          }
        }

        ctx.restore();
      },
    };

    // Create chart
    const createChart = () => {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext('2d');

      const mayoRisk = mayoClassToRisk(props.mayoClass);
      const propkdRisk = propkdToRisk(props.propkdScore);

      const patientCoords = getPatientCoords(mayoRisk, propkdRisk);

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new ChartJS(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Patient Data',
              data: [{ x: patientCoords.x, y: patientCoords.y }],
              pointBackgroundColor: chartConfig.mayoVsPropkdChart.pointColor,
              pointBorderColor: chartConfig.mayoVsPropkdChart.pointColor,
              pointRadius: chartConfig.mayoVsPropkdChart.pointRadius,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          scales: {
            x: {
              type: 'linear',
              min: 0.5,
              max: 3.5,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  return chartConfig.mayoVsPropkdChart.ticks.xTicks[value - 1] || '';
                },
                align: 'center',
                autoSkip: false,
                padding: 10,
              },
              title: {
                display: true,
                text: chartConfig.mayoVsPropkdChart.axisLabels.x,
                font: {
                  size: 14,
                },
              },
              grid: {
                drawBorder: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              type: 'linear',
              min: 0.5,
              max: 3.5,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  return chartConfig.mayoVsPropkdChart.ticks.yTicks[value - 1] || '';
                },
                align: 'center',
                autoSkip: false,
                padding: 10,
              },
              title: {
                display: true,
                text: chartConfig.mayoVsPropkdChart.axisLabels.y,
                font: {
                  size: 14,
                },
              },
              grid: {
                drawBorder: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: () => `Mayo Risk: ${mayoRisk}, PROPKD Risk: ${propkdRisk}`,
              },
            },
          },
        },
        plugins: [backgroundPlugin],
      });
    };

    const downloadChart = () => {
      if (canvas.value) {
        const link = document.createElement('a');
        link.href = canvas.value.toDataURL('image/png');
        link.download = 'mayo_vs_propkd_chart.png';
        link.click();
      }
    };

    // Watch for prop changes
    watch(
      () => [props.mayoClass, props.propkdScore],
      () => {
        createChart();
      }
    );

    // Resize chart on window resize
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    onMounted(() => {
      createChart();
      window.addEventListener('resize', resizeChart);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart);
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    return {
      canvas,
      downloadChart,
    };
  },
};
</script>

<style scoped>
canvas {
  width: 50% !important;
  height: 50% !important;
  margin: 0 auto;
}
</style>

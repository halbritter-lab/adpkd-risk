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
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    mayoScore: Number,
    propkdScore: Number,
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Mapping Mayo and PROPKD scores to risk categories
    const mayoToRisk = (mayoScore) => {
      if (mayoScore === 1 || mayoScore === 2) return 'low';
      if (mayoScore === 3) return 'intermediate';
      return 'high';
    };

    const propkdToRisk = (propkdScore) => {
      if (propkdScore >= 0 && propkdScore <= 3) return 'low';
      if (propkdScore >= 4 && propkdScore <= 6) return 'intermediate';
      return 'high';
    };

    // Create the chart
    const createChart = () => {
      const ctx = canvas.value.getContext('2d');
      const mayoRisk = mayoToRisk(props.mayoScore);
      const propkdRisk = propkdToRisk(props.propkdScore);

      const getPatientCoords = (mayoRisk, propkdRisk) => {
        const xMap = { low: 1, intermediate: 2, high: 3 };
        const yMap = { low: 1, intermediate: 2, high: 3 };
        return { x: xMap[mayoRisk], y: yMap[propkdRisk] };
      };

      const patientCoords = getPatientCoords(mayoRisk, propkdRisk);

      chartInstance = new ChartJS(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Patient Data',
              data: [{ x: patientCoords.x, y: patientCoords.y }],
              pointBackgroundColor: 'black',
              pointBorderColor: 'black',
              pointRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              min: 0.5,
              max: 3.5,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  return ['Low', 'Intermediate', 'High'][value - 1];
                },
              },
              title: {
                display: true,
                text: 'Mayo Risk',
              },
            },
            y: {
              type: 'linear',
              min: 0.5,
              max: 3.5,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  return ['Low', 'Intermediate', 'High'][value - 1];
                },
              },
              title: {
                display: true,
                text: 'PROPKD Risk',
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function () {
                  return `Mayo Risk: ${mayoRisk}, PROPKD Risk: ${propkdRisk}`;
                },
              },
            },
          },
        },
      });
    };

    // Resize chart on window resize
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    // Watch for changes in props and update chart
    watch(
      () => [props.mayoScore, props.propkdScore],
      () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
        createChart();
      }
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

<style scoped>
canvas {
  max-width: 500px;
  margin: 0 auto;
}
</style>

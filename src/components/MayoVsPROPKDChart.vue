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
    mayoScore: {
      type: Number,
      default: 1, // Default Mayo Score if not passed
    },
    propkdScore: {
      type: Number,
      default: 0, // Default PROPKD Score if not passed
    },
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    // Mapping Mayo and PROPKD scores to risk categories
    const mayoToRisk = (mayoScore) => {
      console.log('Converting Mayo Score:', mayoScore); // Debug
      if (typeof mayoScore !== 'number' || mayoScore < 1 || mayoScore > 5) {
        console.warn('Invalid Mayo Score:', mayoScore);
        mayoScore = 1; // Default to low risk if invalid
      }
      if (mayoScore === 1 || mayoScore === 2) return 'low';
      if (mayoScore === 3) return 'intermediate';
      return 'high';
    };

    const propkdToRisk = (propkdScore) => {
      console.log('Converting PROPKD Score:', propkdScore); // Debug
      if (typeof propkdScore !== 'number' || propkdScore < 0 || propkdScore > 9) {
        console.warn('Invalid PROPKD Score:', propkdScore);
        propkdScore = 0; // Default to low risk if invalid
      }
      if (propkdScore >= 0 && propkdScore <= 3) return 'low';
      if (propkdScore >= 4 && propkdScore <= 6) return 'intermediate';
      return 'high';
    };

    // Create the chart
    const createChart = () => {
      if (!canvas.value) {
        console.error('Canvas element is not available'); // Debug
        return;
      }
      const ctx = canvas.value.getContext('2d');

      console.log('Mayo Score:', props.mayoScore, 'PROPKD Score:', props.propkdScore); // Debug

      const mayoRisk = mayoToRisk(props.mayoScore);
      const propkdRisk = propkdToRisk(props.propkdScore);

      console.log('Mayo Risk:', mayoRisk, 'PROPKD Risk:', propkdRisk); // Debug

      const getPatientCoords = (mayoRisk, propkdRisk) => {
        const xMap = { low: 1, intermediate: 2, high: 3 };
        const yMap = { low: 1, intermediate: 2, high: 3 };
        return { x: xMap[mayoRisk], y: yMap[propkdRisk] };
      };

      const patientCoords = getPatientCoords(mayoRisk, propkdRisk);

      console.log('Patient Coordinates:', patientCoords); // Debug

      const backgroundPlugin = {
        id: 'backgroundPlugin',
        beforeDraw: (chart) => {
          const { ctx, scales: { x, y } } = chart;
          ctx.save();

          const colors = [
            ['#E0F0DD', '#CDEBEC', '#CBE4E9'], // Row for low PROPKD
            ['#CDEBEC', '#F9F6CE', '#FCECD8'], // Row for intermediate PROPKD
            ['#CBE4E9', '#FCECD8', '#FBCAC8'], // Row for high PROPKD
          ];

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
        }
      };

      if (chartInstance) {
        chartInstance.destroy(); // Destroy previous chart instance
      }

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
          maintainAspectRatio: true, // Keep aspect ratio intact
          aspectRatio: 1, // Ensure the chart is square
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
        plugins: [backgroundPlugin],
      });
    };

    // Watch for changes in props and update chart
    watch(
      () => [props.mayoScore, props.propkdScore],
      () => {
        console.log('Props changed:', { mayoScore: props.mayoScore, propkdScore: props.propkdScore }); // Debug
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
        chartInstance.destroy(); // Cleanup chart on unmount
      }
    });

    return {
      canvas,
    };
  },
};
</script>

<style scoped>
canvas {
  width: 70% !important;
  height: 70% !important;
  margin: 0 auto;
}
</style>

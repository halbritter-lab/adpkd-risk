<template>
  <div id="app" class="container">
    <!-- Disclaimer Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Disclaimer for ADPKD-Risk Tool</h2>
        <p>This tool provides an estimated risk for ADPKD progression based on user inputs. It is intended for educational purposes only.</p>
        <button @click="closeModal">I Acknowledge</button>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header">
      <h1 class="app-title">
        ADPKD-Risk Tool <span class="app-version">v0.1.0</span>
      </h1>
    </div>

    <!-- Acknowledgment Banner -->
    <div v-if="disclaimerAcknowledged && !showModal" class="acknowledgment-message">
      <button @click="reopenModal">Disclaimer</button>
      acknowledged on this device at: {{ acknowledgmentTime }}.
    </div>

    <!-- Input Section (Split into two columns) -->
    <div class="controls" v-if="disclaimerAcknowledged && !showModal">
      <div class="form-columns">
        <!-- Left column for MAYO score inputs -->
        <div class="input-group-column">
          <h3>MAYO Score Inputs</h3>
          <div class="input-group">
            <label for="age">Age [y]:</label>
            <input type="number" v-model="age" min="20" max="80" placeholder="Enter age" />
          </div>

          <div class="input-group">
            <label for="height">Height [cm]:</label>
            <input type="number" v-model="height" min="100" max="250" placeholder="Enter height in cm" />
          </div>

          <div class="input-group">
            <label for="right-kidney">Right Kidney Volume [ml]:</label>
            <input type="number" v-model="rightKidneyVolume" placeholder="Enter right kidney volume" />
          </div>

          <div class="input-group">
            <label for="left-kidney">Left Kidney Volume [ml]:</label>
            <input type="number" v-model="leftKidneyVolume" placeholder="Enter left kidney volume" />
          </div>
        </div>

        <!-- Right column for PROPKD score inputs -->
        <div class="input-group-column">
          <h3>PROPKD Score Inputs</h3>
          <div class="input-group">
            <label for="genotype">Genotype:</label>
            <select v-model="genotype">
              <option value="PKD1T">PKD1T</option>
              <option value="PKD1NT">PKD1NT</option>
              <option value="PKD2">PKD2</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="button-group">
        <button @click="calculateScores" :disabled="isInvalidInput" class="plot-button">Calculate Scores</button>
      </div>
    </div>

    <!-- Chart Section -->
    <div v-if="showChart" class="chart-container">
      <ScatterChart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ScatterChart from './components/ScatterChart.vue'; // Import the chart component

export default {
  components: {
    ScatterChart,
  },
  setup() {
    const age = ref(null);
    const height = ref(null);
    const rightKidneyVolume = ref(null);
    const leftKidneyVolume = ref(null);
    const genotype = ref(null);
    const showChart = ref(false);
    const showModal = ref(true);
    const disclaimerAcknowledged = ref(false);
    const acknowledgmentTime = ref(null);

    const isInvalidInput = computed(() => {
      return age.value === null || height.value === null || rightKidneyVolume.value === null || leftKidneyVolume.value === null || !genotype.value;
    });

    const chartData = ref({
      datasets: [
        {
          label: 'MAYO Score',
          backgroundColor: 'blue',
          data: [], // Filled dynamically
        },
        {
          label: 'PROPKD Score',
          backgroundColor: 'red',
          data: [], // Filled dynamically
        },
      ],
    });

    const chartOptions = ref({
      scales: {
        x: {
          title: { display: true, text: 'Age [y]' },
          type: 'linear',
          min: 20,
          max: 80,
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Scores' },
          min: 0,
          max: 3000,
        },
      },
    });

    const calculateMAYOScore = (htTKV, age) => {
      return 0.2 * htTKV + age * 0.1;
    };

    const calculatePROPKDScore = () => {
      return genotype.value === 'PKD1T' ? 9 : genotype.value === 'PKD1NT' ? 6 : 3;
    };

    const calculateScores = () => {
      const totalKidneyVolume = rightKidneyVolume.value + leftKidneyVolume.value;
      const heightInMeters = height.value / 100;
      const htTKV = totalKidneyVolume / heightInMeters;

      const mayoScore = calculateMAYOScore(htTKV, age.value);
      const propkdScore = calculatePROPKDScore();

      chartData.value.datasets[0].data.push({ x: age.value, y: mayoScore });
      chartData.value.datasets[1].data.push({ x: age.value, y: propkdScore });

      showChart.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      disclaimerAcknowledged.value = true;
      acknowledgmentTime.value = new Date().toLocaleString();
      localStorage.setItem('disclaimerAcknowledged', 'true');
      localStorage.setItem('acknowledgmentTime', acknowledgmentTime.value);
    };

    const reopenModal = () => {
      showModal.value = true;
    };

    return {
      age,
      height,
      rightKidneyVolume,
      leftKidneyVolume,
      genotype,
      showChart,
      showModal,
      disclaimerAcknowledged,
      acknowledgmentTime,
      isInvalidInput,
      calculateScores,
      chartData,
      chartOptions,
      closeModal,
      reopenModal,
    };
  },
};
</script>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* Keep the app container aligned to the top */
#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align to the top */
  align-items: center;
  height: 100vh; /* Full height of viewport */
}

.header {
  margin-top: 20px; /* Slight space at the top */
}

.app-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.app-version {
  font-size: 0.8em;
  color: #666;
}

/* Flexbox layout for two columns */
.form-columns {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.input-group-column {
  flex: 1;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-group input,
.input-group select {
  padding: 8px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  margin-top: 20px;
}

.plot-button,
.download-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.plot-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.acknowledgment-message {
  background-color: orange;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 1000;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.chart-container {
  margin-top: 30px;
}
</style>

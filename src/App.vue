<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <!-- Top Toolbar with Title, Version, and Theme Toggle -->
    <v-toolbar color="secondary" dark>
      <v-toolbar-title class="d-flex align-center">
        <h1 class="mb-0">ADPKD Risk Calculator</h1>
        <span class="version">v0.1.0</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Theme Toggle Button using Icon -->
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <!-- Top Section: General Inputs -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="patientId" label="Patient ID" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="age" label="Age" type="number" :min="20" :max="80" />
          </v-col>
        </v-row>

        <v-row>
          <!-- Left Section: Mayo Score Inputs (Kidney Volumes) -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Mayo Score Inputs</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="kidneyVolume"
                  label="Kidney Volume (ml)"
                  type="number"
                  :min="0"
                  :max="20000"
                />
                <v-btn @click="calculateScore">Calculate Mayo Score</v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Section: PROPKD Score (Mutation Class) -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>PROPKD Score Inputs</v-card-title>
              <v-card-text>
                <v-select
                  v-model="mutationClass"
                  :items="mutationClasses"
                  label="Mutation Class"
                />
                <v-btn disabled>Calculate PROPKD Score (Coming Soon)</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Chart Section -->
        <v-row justify="center" class="mt-5">
          <v-col cols="12" md="10">
            <div class="chart-container">
              <LineChart :chartData="chartData" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LineChart from './components/LineChart.vue';

export default {
  components: { LineChart },
  data() {
    return {
      patientId: null,
      age: null,
      kidneyVolume: null,
      mutationClass: null,
      mutationClasses: [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'
      ], // Mutation classes for the PROPKD score
      chartData: {
        datasets: [
          {
            label: 'Kidney Volume vs Age',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
          },
        ],
      },
      isDark: true, // Default theme to dark
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark; // Toggle theme between dark and light
    },
    calculateScore() {
      // Validate inputs
      if (!this.age || this.age < 20 || this.age > 80) {
        alert('Please enter a valid age between 20 and 80.');
        return;
      }

      if (!this.kidneyVolume || this.kidneyVolume <= 0 || this.kidneyVolume > 20000) {
        alert('Please enter a valid kidney volume between 0 and 20,000.');
        return;
      }

      const score = this.calculateMayoScore(this.age, this.kidneyVolume);

      const newDataPoint = { x: this.age, y: score };

      // Update the chartData reactively
      this.chartData = {
        ...this.chartData,
        datasets: [
          {
            ...this.chartData.datasets[0],
            data: [...this.chartData.datasets[0].data, newDataPoint],
          },
        ],
      };
    },
    calculateMayoScore(age, kidneyVolume) {
      // Placeholder calculation for Mayo score
      return kidneyVolume;
    },
  },
};
</script>

<style>
/* Title and version styling within toolbar */
.v-toolbar-title {
  display: flex;
  align-items: center;
}

h1 {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  margin: 0;
  padding-right: 10px;
}

.version {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Max width for chart */
.chart-container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>

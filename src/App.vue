<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-toolbar color="secondary" dark>
      <v-toolbar-title class="d-flex align-center">
        <h1 class="mb-0">ADPKD Risk Calculator</h1>
        <span class="version">v0.1.0</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-main>
      <v-container>
        <!-- Patient Information Section -->
        <v-row>
          <v-col cols="12" md="12">
            <v-card outlined class="pa-2 mb-4">
              <v-card-title>Patient Information</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="patientId" label="Patient ID" dense outlined />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="age" label="Age" type="number" :min="20" :max="80" dense outlined />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="height" label="Height (m)" type="number" step="0.01" min="1" dense outlined />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="sex" :items="['Male', 'Female']" label="Sex" dense outlined />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="familyHistory" :items="['Positive', 'Negative']" label="Family History" dense outlined />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Mayo and PROPKD Score Section -->
        <v-row>
          <v-col cols="12" md="6">
            <!-- Mayo Score Section -->
            <v-card outlined class="pa-2 mb-4">
              <v-card-title>Mayo Score</v-card-title>
              <v-card-text>
                <v-select
                  v-model="inputMethod"
                  :items="['Ellipsoid Equation', 'Stereology Method']"
                  label="Input Method"
                  dense
                  outlined
                />
                <template v-if="inputMethod === 'Ellipsoid Equation'">
                  <v-text-field v-model="kidneyRight.sagittal" label="Right Kidney Sagittal Length (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyRight.coronal" label="Right Kidney Coronal Length (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyRight.width" label="Right Kidney Width (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyRight.depth" label="Right Kidney Depth (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyLeft.sagittal" label="Left Kidney Sagittal Length (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyLeft.coronal" label="Left Kidney Coronal Length (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyLeft.width" label="Left Kidney Width (mm)" type="number" dense outlined />
                  <v-text-field v-model="kidneyLeft.depth" label="Left Kidney Depth (mm)" type="number" dense outlined />
                </template>
                <template v-else>
                  <v-text-field
                    v-model="kidneyVolume"
                    label="Total Kidney Volume (mL)"
                    type="number"
                    :min="0"
                    :max="20000"
                    dense
                    outlined
                  />
                </template>
                <v-btn @click="calculateHtTKV" color="primary" class="mt-2">Calculate Mayo Score (HtTKV)</v-btn>
              </v-card-text>
            </v-card>

            <!-- PROPKD Score Section -->
            <v-card outlined class="pa-2">
              <v-card-title>PROPKD Score Inputs</v-card-title>
              <v-card-text>
                <v-select v-model="mutationClass" :items="mutationClasses" label="Mutation Class" dense outlined />
                <v-checkbox v-model="hypertension" label="Hypertension before age 35" dense outlined />
                <v-checkbox v-model="firstUrologicalEvent" label="First urological event before age 35" dense outlined />
                <v-btn @click="calculatePROPKDScore" color="primary" class="mt-2">Calculate PROPKD Score</v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Chart Section -->
          <v-col cols="12" md="6">
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
      height: 1.70, // Set default height in meters
      sex: null,
      familyHistory: null,
      kidneyVolume: null,
      inputMethod: 'Stereology Method',
      kidneyRight: {
        sagittal: null,
        coronal: null,
        width: null,
        depth: null,
      },
      kidneyLeft: {
        sagittal: null,
        coronal: null,
        width: null,
        depth: null,
      },
      mutationClass: null,
      hypertension: false,
      firstUrologicalEvent: false,
      mutationClasses: [
        'PKD2 mutation',
        'Nontruncating PKD1 mutation',
        'Truncating PKD1 mutation',
      ],
      chartData: {
        datasets: [
          {
            label: 'Patient Data',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            showLine: false,
            pointRadius: 5,
          },
        ],
      },
      isDark: false, // Default to light theme
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
    calculateHtTKV() {
      if (!this.age || !this.height || this.height <= 0) {
        alert('Please enter a valid age and height.');
        return;
      }

      let totalVolume = 0;

      if (this.inputMethod === 'Ellipsoid Equation') {
        if (
          !this.kidneyRight.sagittal ||
          !this.kidneyRight.coronal ||
          !this.kidneyRight.width ||
          !this.kidneyRight.depth ||
          !this.kidneyLeft.sagittal ||
          !this.kidneyLeft.coronal ||
          !this.kidneyLeft.width ||
          !this.kidneyLeft.depth
        ) {
          alert('Please enter valid kidney dimensions.');
          return;
        }

        const rightKidneyVolume =
          (Math.PI / 6) *
          ((this.kidneyRight.sagittal + this.kidneyRight.coronal) / 2) *
          this.kidneyRight.width *
          this.kidneyRight.depth;
        const leftKidneyVolume =
          (Math.PI / 6) *
          ((this.kidneyLeft.sagittal + this.kidneyLeft.coronal) / 2) *
          this.kidneyLeft.width *
          this.kidneyLeft.depth;
        totalVolume = rightKidneyVolume + leftKidneyVolume;
      } else {
        if (!this.kidneyVolume || this.kidneyVolume <= 0) {
          alert('Please enter a valid kidney volume.');
          return;
        }
        totalVolume = this.kidneyVolume;
      }

      const htAdjustedTKV = totalVolume / this.height; // Use height in meters directly

      const newDataPoint = { x: this.age, y: htAdjustedTKV, patientId: this.patientId };

      // Create a shallow copy of the dataset to avoid reactivity issues
      const newChartData = { ...this.chartData };
      newChartData.datasets = [
        {
          ...newChartData.datasets[0],
          data: [...newChartData.datasets[0].data, newDataPoint], // Add new data point
        },
      ];

      // Update the chartData with a new reference
      this.chartData = newChartData;
    },
    calculatePROPKDScore() {
      const mutationScore = this.mutationClass === 'PKD2 mutation' ? 0 :
                            this.mutationClass === 'Nontruncating PKD1 mutation' ? 2 : 4;

      const hypertensionScore = this.hypertension ? 2 : 0;
      const urologicalEventScore = this.firstUrologicalEvent ? 2 : 0;
      const totalScore = mutationScore + hypertensionScore + urologicalEventScore;

      alert(`PROPKD Score: ${totalScore}`);
    },
  },
};
</script>

<style>
.chart-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Adjust inputs and padding */
.v-card-text {
  padding: 10px;
}

.v-text-field, .v-select, .v-checkbox {
  margin-bottom: 10px;
}
</style>

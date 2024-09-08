<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-toolbar color="secondary" dark>
      <v-toolbar-title class="d-flex align-center">
        <h2 class="mb-0">ADPKD Risk Calculator</h2>
        <span class="version">v0.1.0</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-main>
      <v-container>
        <!-- Step 1: Patient Information Section -->
        <v-row>
          <v-col cols="12" md="12">
            <v-card outlined class="pa-1 mb-2">
              <v-card-title>
                <v-icon class="mr-2">mdi-numeric-1-circle-outline</v-icon> 
                Patient Information
              </v-card-title>
              <v-card-text class="pa-1">
                <v-row dense>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="patientId" label="Patient ID" dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="age" label="Age" type="number" :min="20" :max="80" dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="height" label="Height (m)" type="number" step="0.01" min="1" dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="sex" :items="['Male', 'Female']" label="Sex" dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="familyHistory" :items="['Positive', 'Negative']" label="Family History" dense outlined density="compact" />
                  </v-col>
                  <!-- Ethnicity Select Input -->
                  <v-col cols="12" sm="2" md="2">
                    <v-select
                      v-model="ethnicity"
                      :items="ethnicityOptions"
                      label="Ethnicity"
                      dense
                      outlined
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

         <!-- Step 2: Mayo and PROPKD Inputs -->
        <v-row>
          <!-- Left Column: Mayo and PROPKD Inputs -->
          <v-col cols="12" md="6">
            <!-- Mayo Score Section -->
            <v-card class="equal-height-card pa-1 mb-2" outlined>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>
                  <v-icon class="mr-2">mdi-numeric-2-circle-outline</v-icon>
                  Mayo Score
                </span>
                <v-select
                  v-model="inputMethod"
                  :items="['Ellipsoid Equation', 'Stereology Method']"
                  dense
                  outlined
                  hide-details
                  style="max-width: 250px;"
                  density="compact"
                />
                <v-btn small color="primary" @click="calculateHtTKV" density="compact">Calculate</v-btn>
              </v-card-title>
              <v-card-text class="pa-1">
                <template v-if="inputMethod === 'Ellipsoid Equation'">
                  <v-row dense>
                    <v-col cols="6">
                      <!-- Left Kidney Inputs -->
                      <v-text-field v-model="kidneyLeft.sagittal" label="Left Kidney Sagittal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.coronal" label="Left Kidney Coronal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.width" label="Left Kidney Width (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.depth" label="Left Kidney Depth (mm)" type="number" dense outlined density="compact" />
                    </v-col>
                    <v-col cols="6">
                      <!-- Right Kidney Inputs -->
                      <v-text-field v-model="kidneyRight.sagittal" label="Right Kidney Sagittal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyRight.coronal" label="Right Kidney Coronal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyRight.width" label="Right Kidney Width (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyRight.depth" label="Right Kidney Depth (mm)" type="number" dense outlined density="compact"/>
                    </v-col>
                  </v-row>
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
                    density="compact"
                  />
                </template>
              </v-card-text>
            </v-card>

          <!-- Step 3: PROPKD Score Section -->
          <v-card class="small-card pa-1" outlined>
            <v-card-title class="d-flex justify-space-between">
              <span>
                <v-icon class="mr-2">mdi-numeric-3-circle-outline</v-icon>
                PROPKD Score
              </span>
              <v-btn small color="primary" @click="calculatePROPKDScore" density="compact">Calculate</v-btn>
            </v-card-title>
            <v-card-text class="pa-1">
              <v-select v-model="mutationClass" :items="mutationClasses" label="Mutation Class" dense outlined density="compact" />
              <v-row dense>
                <v-col cols="6">
                  <v-checkbox v-model="hypertension" label="Hypertension before age 35" dense outlined density="compact" />
                </v-col>
                <v-col cols="6">
                  <v-checkbox v-model="firstUrologicalEvent" label="First urological event before age 35" dense outlined density="compact" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          </v-col>

          <!-- Right Column: Mayo and PROPKD Charts -->
          <v-col cols="12" md="6">
            <!-- Mayo Chart -->
            <v-card class="equal-height-card pa-1 mb-2" outlined>
              <v-card-text class="pa-1">
                <div class="chart-container">
                  <LineChart :chartData="chartData" />
                </div>
              </v-card-text>
            </v-card>

            <!-- PROPKD Chart -->
            <v-card class="small-card pa-1" outlined>
              <v-card-text class="pa-1">
                <PROPKDChart :score="propkdScore" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LineChart from './components/LineChart.vue';
import PROPKDChart from './components/PROPKDChart.vue'; // Import the new component

export default {
  components: { LineChart, PROPKDChart },
  data() {
    return {
      patientId: null,
      age: null,
      height: 1.70, // Set default height in meters
      sex: null,
      familyHistory: null,
      ethnicity: null, // New Ethnicity field
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
      ethnicityOptions: ['AA', 'O'], // Ethnicity options: AA for African American, O for Others
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
      propkdScore: 0, // Initialize the PROPKD score
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
      // Sex score: Male adds 1 point
      const sexScore = this.sex === 'Male' ? 1 : 0;

      // Mutation score based on mutation class
      const mutationScore = this.mutationClass === 'PKD2 mutation' ? 0 :
                            this.mutationClass === 'Nontruncating PKD1 mutation' ? 2 : 4;

      // Hypertension score
      const hypertensionScore = this.hypertension ? 2 : 0;

      // Urological event score
      const urologicalEventScore = this.firstUrologicalEvent ? 2 : 0;

      // Calculate the total PROPKD score
      this.propkdScore = sexScore + mutationScore + hypertensionScore + urologicalEventScore;

      // Optionally, log or display the score
      console.log("Calculated PROPKD Score: ", this.propkdScore);
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
  padding: 5px;
}

.v-text-field, .v-select, .v-checkbox {
  margin-bottom: 5px;
}

/* Equal height class for cards */
.equal-height-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 450px;
}

/* Smaller card for PROPKD */
.small-card {
  min-height: 200px; /* Reduce the min-height for the card */
}

/* Adjust padding and layout inside the PROPKD card */
.small-card .v-card-text {
  padding: 8px; /* Reduce padding inside the card */
}

.small-card .v-select, .small-card .v-checkbox {
  margin-bottom: 4px; /* Tighten spacing between inputs */
}

</style>

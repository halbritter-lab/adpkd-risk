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
        <v-alert v-if="errorMessage" type="error" outlined class="mb-3">
          {{ errorMessage }}
        </v-alert>

        <!-- Step 1: Patient Information Section -->
        <v-row>
          <v-col cols="12" md="12">
            <v-card outlined class="pa-1 mb-2">
              <v-card-title>
                <v-icon :color="isStep1Valid ? 'green' : 'red'" class="mr-2">mdi-numeric-1-circle-outline</v-icon>
                Patient Information
              </v-card-title>
              <v-card-text class="pa-1">
                <v-row dense>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="patientId" label="Patient ID" required dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="age" label="Age" type="number" :min="20" :max="80" required dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field v-model="height" label="Height (m)" type="number" step="0.01" min="1" required dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="sex" :items="['Male', 'Female']" label="Sex" required dense outlined density="compact" />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select v-model="familyHistory" :items="['Positive', 'Negative']" label="Family History" dense outlined density="compact" />
                  </v-col>
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
          <v-col cols="12" md="6">
            <!-- Mayo Score Section -->
            <v-card class="equal-height-card pa-1 mb-2" outlined>
              <v-card-title class="d-flex justify-space-between align-center">
                <v-icon :color="isMayoScoreCalculated ? 'green' : 'red'" class="mr-2">mdi-numeric-2-circle-outline</v-icon>
                Mayo Score
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
                      <v-text-field v-model="kidneyLeft.sagittal" label="Left Kidney Sagittal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.coronal" label="Left Kidney Coronal Length (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.width" label="Left Kidney Width (mm)" type="number" dense outlined density="compact" />
                      <v-text-field v-model="kidneyLeft.depth" label="Left Kidney Depth (mm)" type="number" dense outlined density="compact" />
                    </v-col>
                    <v-col cols="6">
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

            <!-- PROPKD Score Section -->
            <v-card class="small-card pa-1" outlined>
              <v-card-title class="d-flex justify-space-between">
                <v-icon :color="isPROPKDScoreCalculated ? 'green' : 'red'" class="mr-2">mdi-numeric-3-circle-outline</v-icon>
                PROPKD Score
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

          <!-- Right Column: Mayo and PROPKD Charts in Tabs (with cards) -->
          <v-col cols="12" md="6">
            <v-card outlined class="pa-2 mb-2">
              <v-tabs v-model="selectedTab" align-tabs="center">
                <v-tab value="mayoPropkd">Mayo and PROPKD</v-tab>
                <v-tab value="mayoVsPropkd" :disabled="!isMayoScoreCalculated || !isPROPKDScoreCalculated">Mayo vs PROPKD</v-tab>
              </v-tabs>

              <v-tabs-window v-model="selectedTab">
                <v-tabs-window-item value="mayoPropkd">
                  <v-card class="equal-height-card pa-1 mb-2" outlined>
                    <v-card-text class="pa-1">
                      <div class="chart-container">
                        <LineChart :chartData="chartData" />
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-card class="small-card pa-1" outlined>
                    <v-card-text class="pa-1">
                      <PROPKDChart :score="propkdScore" />
                    </v-card-text>
                  </v-card>
                </v-tabs-window-item>

                <v-tabs-window-item value="mayoVsPropkd">
                  <v-card outlined>
                    <v-card-text>
                      <MayoVsPROPKDChart :mayoScore="mayoScore" :propkdScore="propkdScore" />
                    </v-card-text>
                  </v-card>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LineChart from './components/LineChart.vue';
import PROPKDChart from './components/PROPKDChart.vue';
import MayoVsPROPKDChart from './components/MayoVsPROPKDChart.vue';

export default {
  components: { LineChart, PROPKDChart, MayoVsPROPKDChart },
  data() {
    return {
      selectedTab: 'mayoPropkd',
      patientId: null,
      age: null,
      height: 1.70,
      sex: null,
      familyHistory: null,
      ethnicity: null,
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
      ethnicityOptions: ['AA', 'O'],
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
      isDark: false,
      mayoScore: 1, // Set a default valid score
      propkdScore: 0,
      mayoClass: 'low',
      errorMessage: null, // To display validation errors
    };
  },
  computed: {
    isStep1Valid() {
      return this.patientId && this.age && this.height && this.sex;
    },
    isMayoScoreCalculated() {
      return this.mayoScore > 1;
    },
    isPROPKDScoreCalculated() {
      return this.propkdScore > 0;
    },
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
    getMayoClass(volume) {
      if (volume < 233.695) return 'low';
      if (volume < 290.292) return 'intermediate';
      if (volume < 359.484) return 'high';
      return 'very high';
    },
    validateStep1() {
      if (!this.isStep1Valid) {
        this.errorMessage = 'Please fill in all required fields in Step 1: Patient ID, Age, Height, and Sex.';
        return false;
      }
      this.errorMessage = null; // Clear error message if valid
      return true;
    },
    calculateHtTKV() {
      if (!this.validateStep1()) {
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
          this.errorMessage = 'Please enter valid kidney dimensions for both kidneys.';
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
          this.errorMessage = 'Please enter a valid total kidney volume.';
          return;
        }
        totalVolume = this.kidneyVolume;
      }

      const htAdjustedTKV = totalVolume / this.height;
      this.mayoClass = this.getMayoClass(htAdjustedTKV);
      this.mayoScore = Math.min(Math.max(htAdjustedTKV, 1), 5); // Ensure Mayo Score is between 1 and 5

      const newDataPoint = { x: this.age, y: htAdjustedTKV, patientId: this.patientId, mayoClass: this.mayoClass };

      const newChartData = { ...this.chartData };
      newChartData.datasets = [
        {
          ...newChartData.datasets[0],
          data: [...newChartData.datasets[0].data, newDataPoint],
        },
      ];

      this.chartData = newChartData;
      this.errorMessage = null; // Clear error message after successful calculation
    },
    calculatePROPKDScore() {
      if (!this.sex || !this.mutationClass) {
        this.errorMessage = 'Sex and Mutation Class are required to calculate PROPKD Score.';
        return;
      }

      const sexScore = this.sex === 'Male' ? 1 : 0;
      const mutationScore = this.mutationClass === 'PKD2 mutation' ? 0 :
                            this.mutationClass === 'Nontruncating PKD1 mutation' ? 2 : 4;
      const hypertensionScore = this.hypertension ? 2 : 0;
      const urologicalEventScore = this.firstUrologicalEvent ? 2 : 0;

      this.propkdScore = Number(sexScore + mutationScore + hypertensionScore + urologicalEventScore) || 0;
      this.errorMessage = null; // Clear error message after successful calculation
    },
  },
};
</script>

<style>
.chart-container {
  max-width: 1000px;
  margin: 0 auto;
}

.v-card-text {
  padding: 5px;
}

.v-text-field, .v-select, .v-checkbox {
  margin-bottom: 5px;
}

.equal-height-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 450px;
}

.small-card {
  min-height: 200px;
}

.small-card .v-card-text {
  padding: 8px;
}

.small-card .v-select, .small-card .v-checkbox {
  margin-bottom: 4px;
}
</style>

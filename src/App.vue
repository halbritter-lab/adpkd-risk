<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <MenuBar
      :version="version"
      :lastCommitHash="lastCommitHash"
      :fetchError="fetchError"
      :isDark="isDark"
      @toggle-theme="toggleTheme"
      @reset-form="resetForm"
      @open-faq="openFAQ"
    />

    <v-main>
      <v-container>

        <!-- Step 1: Individual Information Section -->
        <v-row>
          <v-col cols="12" md="12">
            <v-card outlined class="pa-1 mb-2">
              <v-card-title>
                <span>
                  <v-icon :color="isStep1Valid ? 'green' : 'red'" class="mr-2" aria-hidden="true">mdi-numeric-1-circle-outline</v-icon>
                  <span aria-label="Patient Information Section">Individual</span>
                </span>
              </v-card-title>
              <v-card-text class="pa-1">
                <v-row dense>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="patient.patientId"
                      label="Patient ID"
                      required
                      dense
                      outlined
                      density="compact"
                      aria-label="Patient ID"
                    />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="patient.age"
                      label="Age"
                      type="number"
                      :rules="ageRules"
                      dense
                      outlined
                      density="compact"
                      required
                      aria-label="Patient Age"
                    />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field
                      v-model="patient.height"
                      label="Height (m)"
                      type="number"
                      step="0.01"
                      min="1.4"
                      :max="2.4"
                      required
                      dense
                      outlined
                      density="compact"
                      aria-label="Patient Height"
                    />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select
                      v-model="patient.sex"
                      :items="['Male', 'Female']"
                      label="Sex"
                      required
                      dense
                      outlined
                      density="compact"
                      aria-label="Patient Sex"
                    />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select
                      v-model="patient.familyHistory"
                      :items="['Positive', 'Negative']"
                      label="Family History"
                      dense
                      outlined
                      density="compact"
                      aria-label="Family History"
                    />
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-select
                      v-model="patient.ethnicity"
                      :items="ethnicityOptions"
                      label="Ethnicity"
                      dense
                      outlined
                      density="compact"
                      aria-label="Ethnicity"
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
            <v-card class="equal-height-card pa-1 mb-2" outlined>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>
                  <v-icon :color="isMayoScoreCalculated ? 'green' : 'red'" class="mr-2" aria-hidden="true">mdi-numeric-2-circle-outline</v-icon>
                  <span aria-label="Mayo Score Section">Mayo</span>
                </span>
                <v-select
                  v-model="inputMethod"
                  :items="['Ellipsoid Equation', 'Stereology Method']"
                  dense
                  outlined
                  hide-details
                  style="max-width: 250px;"
                  density="compact"
                  aria-label="Input Method"
                />
                <v-btn small color="primary" @click="calculateHtTKV" density="compact" aria-label="Calculate Mayo Score">
                  Calculate
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-1">
                <template v-if="inputMethod === 'Ellipsoid Equation'">
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="patient.kidneyLeft.sagittal"
                        label="Left Kidney Sagittal Length (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Left Kidney Sagittal Length"
                      />
                      <v-text-field
                        v-model="patient.kidneyLeft.coronal"
                        label="Left Kidney Coronal Length (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Left Kidney Coronal Length"
                      />
                      <v-text-field
                        v-model="patient.kidneyLeft.width"
                        label="Left Kidney Width (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Left Kidney Width"
                      />
                      <v-text-field
                        v-model="patient.kidneyLeft.depth"
                        label="Left Kidney Depth (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Left Kidney Depth"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="patient.kidneyRight.sagittal"
                        label="Right Kidney Sagittal Length (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Right Kidney Sagittal Length"
                      />
                      <v-text-field
                        v-model="patient.kidneyRight.coronal"
                        label="Right Kidney Coronal Length (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Right Kidney Coronal Length"
                      />
                      <v-text-field
                        v-model="patient.kidneyRight.width"
                        label="Right Kidney Width (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Right Kidney Width"
                      />
                      <v-text-field
                        v-model="patient.kidneyRight.depth"
                        label="Right Kidney Depth (mm)"
                        type="number"
                        dense
                        outlined
                        density="compact"
                        aria-label="Right Kidney Depth"
                      />
                    </v-col>
                  </v-row>
                </template>
                <template v-else>
                  <v-text-field
                    v-model="patient.kidneyVolume"
                    label="Total Kidney Volume (mL)"
                    type="number"
                    :min="0"
                    :max="20000"
                    dense
                    outlined
                    density="compact"
                    aria-label="Total Kidney Volume"
                  />
                </template>
              </v-card-text>
            </v-card>

            <!-- PROPKD Score Section -->
            <v-card class="small-card pa-1" outlined>
              <v-card-title class="d-flex justify-space-between">
                <span>
                  <v-icon :color="isPROPKDScoreCalculated ? 'green' : 'red'" class="mr-2" aria-hidden="true">mdi-numeric-3-circle-outline</v-icon>
                  <span aria-label="PROPKD Score Section">PROPKD</span>
                </span>
                <v-btn small color="primary" @click="calculatePROPKDScore" density="compact" aria-label="Calculate PROPKD Score">
                  Calculate
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-1">
                <v-select
                  v-model="patient.mutationClass"
                  :items="mutationClasses"
                  label="Mutation Class"
                  dense
                  outlined
                  density="compact"
                  aria-label="Mutation Class"
                />
                <v-row dense>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="patient.hypertension"
                      label="Hypertension before age 35"
                      dense
                      outlined
                      density="compact"
                      aria-label="Hypertension before age 35"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="patient.firstUrologicalEvent"
                      label="First urological event before age 35"
                      dense
                      outlined
                      density="compact"
                      aria-label="First urological event before age 35"
                    />
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

        <!-- Alert for missing data -->
        <v-alert v-if="errorMessage" type="error" outlined class="mt-3" aria-live="assertive">
          {{ errorMessage }}
        </v-alert>

        <!-- Acknowledgment message -->
        <v-alert
          v-if="disclaimerAcknowledged && !showModal"
          type="info"
          dismissible
          aria-live="polite"
          class="disclaimer-acknowledgment"
        >
          <div class="disclaimer-content">
            <v-btn small outlined @click="reopenModal" class="small-btn" density="compact">Disclaimer acknowledged: {{ acknowledgmentTime }}</v-btn>
          </div>
        </v-alert>

        <!-- Modal for Disclaimer -->
        <v-dialog v-model="showModal" persistent max-width="500">
          <v-card>
            <v-card-title>Disclaimer</v-card-title>
            <v-card-text>
              <section v-for="(section, index) in disclaimerSections" :key="index">
                <h3>{{ section.title }}</h3>
                <p v-html="section.content"></p>
              </section>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="closeModal">I Acknowledge</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal for FAQ -->
        <v-dialog v-model="showFAQModal" persistent max-width="600">
          <v-card>
            <v-card-title>Frequently Asked Questions (FAQ)</v-card-title>
            <v-card-text>
              <ul>
                <li v-for="(faq, index) in faqContent" :key="index">
                  <h4>{{ faq.question }}</h4>
                  <p>{{ faq.answer }}</p>
                </li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="closeFAQ">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import packageInfo from '../package.json'; // Import the package.json file
import MenuBar from './components/MenuBar.vue';
import LineChart from './components/LineChart.vue';
import PROPKDChart from './components/PROPKDChart.vue';
import MayoVsPROPKDChart from './components/MayoVsPROPKDChart.vue';
import Patient from './models/Patient'; // Import the Patient class
import TextMixin from './mixins/TextMixin.js'; // Import the TextMixin

export default {
  components: { MenuBar, LineChart, PROPKDChart, MayoVsPROPKDChart },
  mixins: [TextMixin], // Integrating the TextMixin
  data() {
    return {
      version: packageInfo.version, // Load version from package.json
      lastCommitHash: 'loading...', // Initialize lastCommitHash
      fetchError: false, // Initialize fetchError to track API status
      selectedTab: 'mayoPropkd',
      patient: new Patient(), // Initialize a new Patient object
      ethnicityOptions: ['AA', 'O'],
      inputMethod: 'Stereology Method',
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
      isDark: false,
      mayoScore: 1, // Set a default valid score
      propkdScore: 0,
      mayoClass: 'low',
      errorMessage: null, // To display validation errors
      ageRules: [
        v => !!v || 'Age is required',
        v => (v >= 20 && v <= 80) || 'Age must be between 20 and 80',
      ],
      // Disclaimer modal data
      showModal: !localStorage.getItem('disclaimerAcknowledged'),
      disclaimerAcknowledged: !!localStorage.getItem('disclaimerAcknowledged'),
      acknowledgmentTime: localStorage.getItem('acknowledgmentTime') || null,
      // FAQ Modal data
      showFAQModal: false,
    };
  },
  computed: {
    isStep1Valid() {
      return this.patient.patientId && this.patient.age && this.patient.height && this.patient.sex;
    },
    isMayoScoreCalculated() {
      return this.patient.mayoScore > 1;
    },
    isPROPKDScoreCalculated() {
      return this.patient.propkdScore > 0;
    },
  },
  methods: {
    async fetchLastCommit() {
      try {
        const response = await fetch('https://api.github.com/repos/halbritter-lab/adpkd-risk/commits?per_page=1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length) {
          this.lastCommitHash = data[0].sha.substring(0, 7); // Display only the first 7 characters of the hash
        }
      } catch (error) {
        console.error('Error fetching last commit hash:', error);
        this.fetchError = true; // Update error state
        this.lastCommitHash = 'offline'; // Show 'offline' when there's an error
      }
    },
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
    resetForm() {
      this.patient = new Patient(); // Reset the patient data to a new instance
      this.errorMessage = null;
      this.selectedTab = 'mayoPropkd'; // Reset to the first tab
    },
    calculateHtTKV() {
      if (!this.validateStep1()) {
        console.log("Step 1 validation failed.");
        return;
      }

      try {
        console.log("Before HtTKV Calculation:", this.patient);

        // Calculate HtTKV using the Patient class method
        const htAdjustedTKV = this.patient.calculateHtTKV(); // Use this return value for the Y-axis

        console.log("After HtTKV Calculation:", htAdjustedTKV, this.patient.mayoClass);

        const newDataPoint = {
          x: this.patient.age, // X-axis: Patient age
          y: htAdjustedTKV,    // Y-axis: HtTKV
          patientId: this.patient.patientId,
          mayoClass: this.patient.mayoClass,
        };

        console.log("New Data Point:", newDataPoint);

        // Check if the patientId already exists in the dataset and update the data point
        const clonedChartData = JSON.parse(JSON.stringify(this.chartData));
        const existingIndex = clonedChartData.datasets[0].data.findIndex(
          point => point.patientId === this.patient.patientId
        );

        if (existingIndex !== -1) {
          // Update existing data point
          clonedChartData.datasets[0].data[existingIndex] = newDataPoint;
        } else {
          // Add new data point if patientId doesn't exist
          clonedChartData.datasets[0].data.push(newDataPoint);
        }

        this.chartData = clonedChartData;

        console.log("Updated Chart Data:", this.chartData);

        this.errorMessage = null; // Clear error message after successful calculation
      } catch (error) {
        console.error("Error during HtTKV Calculation:", error);
        this.errorMessage = error.message;
      }
    },
    calculatePROPKDScore() {
      if (!this.patient.sex || !this.patient.mutationClass) {
        this.errorMessage = 'Sex and Mutation Class are required to calculate PROPKD Score.';
        return;
      }

      try {
        console.log("Before PROPKD Calculation:", this.patient);

        // Use the method from the Patient class to calculate PROPKD score
        this.patient.calculatePROPKDScore();

        // Log the calculated score for debugging
        console.log("Calculated PROPKD Score:", this.patient.propkdScore);

        this.propkdScore = this.patient.propkdScore;  // Update the computed PROPKD score in the Vue data

        this.errorMessage = null; // Clear any error messages
      } catch (error) {
        console.error("Error during PROPKD Calculation:", error);
        this.errorMessage = error.message;
      }
    },
    closeModal() {
      this.showModal = false;
      this.disclaimerAcknowledged = true;

      // Format the current time to only show date
      const currentDate = new Date().toLocaleDateString(); // Only the date part
      this.acknowledgmentTime = currentDate;

      localStorage.setItem('disclaimerAcknowledged', 'true');
      localStorage.setItem('acknowledgmentTime', currentDate);
    },
    reopenModal() {
      this.showModal = true;
    },
    // Methods for FAQ Modal
    openFAQ() {
      this.showFAQModal = true;
    },
    closeFAQ() {
      this.showFAQModal = false;
    },
  },
  async mounted() {
    this.fetchLastCommit(); // Call to fetch the last commit hash when the component is mounted
  },
};
</script>

<style scoped>
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

/* Styling for the application title */
.app-title {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff; /* Improved contrast for dark theme */
}

.app-version {
  color: #e0e0e0; /* Light contrast for version text */
}

/* Styling for buttons */
.v-btn {
  background-color: #0056b3;
  color: white;
}

/* Button hover state */
.v-btn:hover {
  background-color: #004085;
  color: white;
}

/* Logo styling */
.app-logo {
  max-width: 48px;
  margin-right: 20px;
  animation: fadeIn 2s ease-out forwards;
}

/* Logo hover animation */
.app-logo:hover {
  animation: pulse 2s infinite;
}

/* Styling for the disclaimer acknowledgment */
.disclaimer-acknowledgment {
  position: fixed;
  bottom: 0;
  right: 0;
  width: auto;
  max-width: 250px; /* Smaller width to make it more compact */
  z-index: 1000;
  padding: 2px;
  font-size: 8px; /* Reduced font size for smaller text */
}

.disclaimer-content {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Align content to the right */
}

/* Styling for the much smaller button */
.small-btn {
  font-size: 8px; /* Smaller font for the button */
  padding: 1px 2px; /* Reduced padding to make the button compact */
  min-width: auto; /* Remove the default minimum button width */
}
</style>

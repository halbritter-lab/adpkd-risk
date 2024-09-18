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

    <div id="app-content">
    <v-main>
      <v-container>
        <!-- Step 1: Individual Information Section -->
        <v-row>
          <v-col cols="12" md="12">
            <v-card outlined class="pa-1 mb-2">
              <v-card-title>
                <span>
                  <v-icon
                    :color="isStep1Valid ? config.validationIconColors.valid : config.validationIconColors.invalid"
                    class="mr-2"
                    aria-hidden="true"
                    >mdi-numeric-1-circle-outline</v-icon
                  >
                  <v-tooltip activator="parent" location="top">
                    Enter the basic information for the individual needed to calculate the Mayo and PROPKD scores.
                  </v-tooltip>
                  <span aria-label="Patient Information Section">Individual</span>
                </span>
              </v-card-title>
              <v-card-text class="pa-1">
                <v-row dense>
                  <v-col cols="12" sm="3" md="3">
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
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field
                      v-model="patient.age"
                      label="Age"
                      type="number"
                      :rules="config.age.rules"
                      dense
                      outlined
                      density="compact"
                      required
                      aria-label="Patient Age"
                    />
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field
                      v-model="patient.height"
                      label="Height (m)"
                      type="number"
                      :step="config.height.step"
                      :min="config.height.min"
                      :max="config.height.max"
                      required
                      dense
                      outlined
                      density="compact"
                      aria-label="Patient Height"
                    />
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
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
                  <v-icon
                    :color="isMayoScoreCalculated ? config.validationIconColors.valid : config.validationIconColors.invalid"
                    class="mr-2"
                    aria-hidden="true"
                    >mdi-numeric-2-circle-outline</v-icon
                  >
                  <v-tooltip activator="parent" location="top">
                    Enter the kidney measurements to calculate the Mayo score. If you have the total kidney volume, select the input method accordingly.
                  </v-tooltip>
                  <span aria-label="Mayo Score Section">Mayo</span>
                </span>
                <v-select
                  v-model="inputMethod"
                  :items="config.inputMethods"
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
                  <!-- Display calculated kidney volumes -->
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="rightKidneyVolume"
                        label="Right Kidney Volume (mL)"
                        dense
                        outlined
                        density="compact"
                        readonly
                        aria-label="Right Kidney Volume"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="leftKidneyVolume"
                        label="Left Kidney Volume (mL)"
                        dense
                        outlined
                        density="compact"
                        readonly
                        aria-label="Left Kidney Volume"
                      />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="totalKidneyVolume"
                        label="Total Kidney Volume (mL)"
                        dense
                        outlined
                        density="compact"
                        readonly
                        aria-label="Total Kidney Volume"
                      />
                    </v-col>
                  </v-row>
                  <v-btn small color="primary" @click="calculateVolumes" density="compact" aria-label="Calculate Volumes">
                    Calculate Volumes
                  </v-btn>
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

            <!-- Step 3: PROPKD Score Section -->
            <v-card class="small-card pa-1" outlined>
              <v-card-title class="d-flex justify-space-between">
                <span>
                  <v-icon
                    :color="(isPROPKDScoreCalculated && this.patient.sex && this.patient.mutationClass) ? config.validationIconColors.valid : config.validationIconColors.invalid"
                    class="mr-2"
                    aria-hidden="true"
                    >mdi-numeric-3-circle-outline</v-icon
                  >
                  <v-tooltip activator="parent" location="top">
                    Enter the mutation class and check if the patient had hypertension or first urological event before age 35 to calculate the PROPKD score.
                  </v-tooltip>
                  <span aria-label="PROPKD Score Section">PROPKD</span>
                </span>
                <v-btn small color="primary" @click="calculatePROPKDScore" density="compact" aria-label="Calculate PROPKD Score">
                  Calculate
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-1">
                <v-select
                  v-model="patient.mutationClass"
                  :items="config.mutationClasses"
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
                <v-tab value="mayoVsPropkd" :disabled="!isMayoScoreCalculated || !isPROPKDScoreCalculated"
                  >Mayo vs PROPKD</v-tab
                >
              </v-tabs>

              <v-tabs-window v-model="selectedTab">
                <v-tabs-window-item value="mayoPropkd">
                  <v-card class="equal-height-card pa-1 mb-2" outlined>
                    <v-card-text class="pa-1">
                      <div class="chart-container">
                        <LineChart :chartData="chartData" :propkdRiskLevel="propkdRiskLevel" />
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
                      <MayoVsPROPKDChart :mayoClass="patient.mayoClass" :propkdScore="propkdScore" />
                    </v-card-text>
                  </v-card>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
          <v-col cols="12">
            <PatientOverview :patient="patient" />
          </v-col>
        </v-row>

        <!-- Acknowledgment message -->
        <v-alert
          v-if="disclaimerAcknowledged && !showModal"
          type="info"
          dismissible
          aria-live="polite"
          class="disclaimer-acknowledgment"
        >
          <div class="disclaimer-content mx-0">
            <v-btn small outlined @click="reopenModal" class="small-btn mx-0" density="compact"> Disclaimer </v-btn>
            <v-tooltip activator="parent" location="left">
             acknowledged: {{ acknowledgmentTime }}
            </v-tooltip>
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

        <!-- Alert for missing data -->
        <v-alert v-if="errorMessage" type="error" outlined class="mt-3" aria-live="assertive">
          {{ errorMessage }}
        </v-alert>

        <FooterLogos />

      </v-container>
    </v-main>
    </div>
  </v-app>
</template>

<script>
import config from './config/appConfig.js'; // Import the config file
import formulasConfig from './config/formulasConfig.js';
import packageInfo from '../package.json'; // Import the package.json file
import MenuBar from './components/MenuBar.vue';
import FooterLogos from './components/FooterLogos.vue';
import LineChart from './components/LineChart.vue';
import PROPKDChart from './components/PROPKDChart.vue';
import MayoVsPROPKDChart from './components/MayoVsPROPKDChart.vue';
import PatientOverview from './components/PatientOverview.vue';
import Patient from './models/Patient'; // Import the Patient class
import TextMixin from './mixins/TextMixin.js'; // Import the TextMixin

export default {
  components: { MenuBar, LineChart, PROPKDChart, MayoVsPROPKDChart, PatientOverview, FooterLogos },
  mixins: [TextMixin], // Integrating the TextMixin
  data() {
    return {
      config, // Store config in the data for easy access
      version: packageInfo.version, // Load version from package.json
      lastCommitHash: 'loading...', // Initialize lastCommitHash
      fetchError: false, // Initialize fetchError to track API status
      selectedTab: 'mayoPropkd',
      patient: new Patient(), // Initialize a new Patient object
      inputMethod: config.inputMethods[1], // Default input method
      chartData: {
        datasets: [
          {
            label: 'Patient Data',
            data: [],
            borderColor: config.chartConfig.dataset.borderColor,
            backgroundColor: config.chartConfig.dataset.backgroundColor,
            showLine: false,
            pointRadius: config.chartConfig.dataset.pointRadius,
          },
        ],
      },
      isDark: false,
      mayoScore: 1,
      propkdScore: 0,
      errorMessage: null, // To display validation errors
      // Kidney volume variables
      rightKidneyVolume: null,
      leftKidneyVolume: null,
      totalKidneyVolume: null,
      // Disclaimer modal data
      showModal: config.modals.disclaimerAcknowledged.show,
      disclaimerAcknowledged: config.modals.disclaimerAcknowledged.acknowledged,
      acknowledgmentTime: config.modals.disclaimerAcknowledged.acknowledgmentTime,
      // FAQ Modal data
      showFAQModal: config.modals.faq.show,
      propkdRiskLevel: 'default'
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
      return this.patient.propkdScore >= 0;
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
    getMayoClass(htAdjustedTKV, patientAge) {
      const mayoClasses = formulasConfig.mayoClasses;

      // Start from the highest class and check downward
      if (htAdjustedTKV >= this.calculateY(mayoClasses.class1E.slope, mayoClasses.class1E.intercept, patientAge)) {
        return 'class1E';
      } else if (htAdjustedTKV >= this.calculateY(mayoClasses.class1D.slope, mayoClasses.class1D.intercept, patientAge)) {
        return 'class1D';
      } else if (htAdjustedTKV >= this.calculateY(mayoClasses.class1C.slope, mayoClasses.class1C.intercept, patientAge)) {
        return 'class1C';
      } else if (htAdjustedTKV >= this.calculateY(mayoClasses.class1B.slope, mayoClasses.class1B.intercept, patientAge)) {
        return 'class1B';
      }

      return 'class1A'; // If none of the above, assign class 1A
    },
    calculateY(slope, intercept, x) {
      return Math.pow(10, slope * x + intercept);
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
        console.log('Step 1 validation failed.');
        return;
      }

      try {
        // Pass the Mayo class calculator method and patient age when calculating HtTKV
        let htAdjustedTKV = this.patient.calculateHtTKV((htk) => this.getMayoClass(htk, this.patient.age));

        // Round htAdjustedTKV to a maximum of 2 decimal places
        htAdjustedTKV = Math.round(htAdjustedTKV * 100) / 100;

        const newDataPoint = {
          x: this.patient.age, // X-axis: Patient age
          y: htAdjustedTKV,    // Y-axis: HtTKV
          patientId: this.patient.patientId,
          mayoClass: this.patient.mayoClass,
        };

        // Update the chart data
        const clonedChartData = JSON.parse(JSON.stringify(this.chartData));
        const existingIndex = clonedChartData.datasets[0].data.findIndex(
          (point) => point.patientId === this.patient.patientId
        );

        if (existingIndex !== -1) {
          // Update existing data point
          clonedChartData.datasets[0].data[existingIndex] = newDataPoint;
        } else {
          // Add new data point if patientId doesn't exist
          clonedChartData.datasets[0].data.push(newDataPoint);
        }

        this.chartData = clonedChartData;

        this.errorMessage = null; // Clear error message after successful calculation
      } catch (error) {
        console.error('Error during HtTKV Calculation:', error);
        this.errorMessage = error.message;
      }
    },
    calculateVolumes() {
      try {
        // Fetch input values for right and left kidneys using correct object structure
        const rSagittalLength = parseFloat(this.patient.kidneyRight.sagittal) || 0;
        const rCoronalLength = parseFloat(this.patient.kidneyRight.coronal) || 0;
        const rWidth = parseFloat(this.patient.kidneyRight.width) || 0;
        const rDepth = parseFloat(this.patient.kidneyRight.depth) || 0;

        const lSagittalLength = parseFloat(this.patient.kidneyLeft.sagittal) || 0;
        const lCoronalLength = parseFloat(this.patient.kidneyLeft.coronal) || 0;
        const lWidth = parseFloat(this.patient.kidneyLeft.width) || 0;
        const lDepth = parseFloat(this.patient.kidneyLeft.depth) || 0;

        // Check if all required inputs are provided
        if (!(rSagittalLength && rCoronalLength && rWidth && rDepth && lSagittalLength && lCoronalLength && lWidth && lDepth)) {
          throw new Error('All fields for length, width, and depth must have valid numeric values.');
        }

        // Average lengths for right and left kidneys
        const rightLength = (rSagittalLength + rCoronalLength) / 2;
        const leftLength = (lSagittalLength + lCoronalLength) / 2;

        // Calculate volumes using the provided formula
        const rightKidneyVolume = Math.round(10 * (formulasConfig.volumeFormula.pi * rightLength * rWidth * rDepth) / formulasConfig.volumeFormula.divisor) / 10;
        const leftKidneyVolume = Math.round(10 * (formulasConfig.volumeFormula.pi * leftLength * lWidth * lDepth) / formulasConfig.volumeFormula.divisor) / 10;

        // Total kidney volume
        const totalKidneyVolume = Math.round(10 * (rightKidneyVolume + leftKidneyVolume)) / 10;

        // Store computed volumes in Vue instance data
        this.rightKidneyVolume = rightKidneyVolume;
        this.leftKidneyVolume = leftKidneyVolume;
        this.totalKidneyVolume = totalKidneyVolume;

        // Update patient object with calculated values
        this.patient.kidneyRight.volume = this.rightKidneyVolume;
        this.patient.kidneyLeft.volume = this.leftKidneyVolume;
        this.patient.kidneyVolume = this.totalKidneyVolume;
      } catch (error) {
        console.error('Error calculating kidney volumes:', error);
        this.errorMessage = error.message;
      }
    },
    calculatePROPKDScore() {
      if (!this.patient.sex || !this.patient.mutationClass) {
        this.errorMessage = 'Sex and Mutation Class are required to calculate PROPKD Score.';
        return;
      }

      try {
        // Use the method from the Patient class to calculate PROPKD score
        this.patient.calculatePROPKDScore();

        this.propkdScore = this.patient.propkdScore; // Update the computed PROPKD score in the Vue data

        // assign the risk level based on the computed PROPKD score
        if (this.patient.propkdScore >= 7) {
          this.propkdRiskLevel = 'highRisk';
        } 
        else if (this.patient.propkdScore < 4) {
          this.propkdRiskLevel = 'lowRisk';
        } 
        else {
          this.propkdRiskLevel = 'default';
        }

        this.errorMessage = null; // Clear any error messages
      } catch (error) {
        console.error('Error during PROPKD Calculation:', error);
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
  z-index: 1005;
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

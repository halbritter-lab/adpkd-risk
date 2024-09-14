<template>
  <v-card outlined class="pa-2">
    <v-card-title>
      <span>Overview</span>
      <!-- Add export button -->
      <v-btn
        small
        density="compact"
        icon @click="exportAsExcel"
        aria-label="Export as Excel"
        style="margin-left: 16px;"
      >
        <v-icon>mdi-file-excel</v-icon>
        <v-tooltip activator="parent" location="bottom">
          Export as Excel
        </v-tooltip>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-table dense>
        <thead>
          <tr>
            <th v-for="column in visibleColumns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-if="columns.patientId">{{ patient.patientId }}</td>
            <td v-if="columns.age">{{ patient.age }}</td>
            <td v-if="columns.height">{{ patient.height }}</td>
            <td v-if="columns.mayoClass">{{ patient.mayoClass }}</td>
            <td v-if="columns.propkdScore">{{ patient.propkdScore }}</td>
            <!-- Add more columns as needed -->
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
// Import the XLSX library
import * as XLSX from 'xlsx';

export default {
  props: {
    patient: {
      type: Object,
      required: true,
    },
    visibleColumns: {
      type: Array,
      default: () => ['Patient ID', 'Age', 'Height', 'Mayo Class', 'PROPKD Score'],
    },
    columns: {
      type: Object,
      default: () => ({
        patientId: true,
        age: true,
        height: true,
        mayoClass: true,
        propkdScore: true,
      }),
    },
  },
  methods: {
    exportAsExcel() {
      // Prepare data for Excel export
      const data = [
        {
          'Patient ID': this.patient.patientId,
          Age: this.patient.age,
          Height: this.patient.height,
          'Mayo Class': this.patient.mayoClass,
          'PROPKD Score': this.patient.propkdScore,
        },
      ];

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Patient Data');

      // Export the workbook as an Excel file
      XLSX.writeFile(wb, `patient_data_${new Date().toISOString()}.xlsx`);
    },
  },
};
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>

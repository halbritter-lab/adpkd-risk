<template>
  <v-card outlined class="pa-2">
    <v-card-title>
      <span>Overview</span>
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
};
</script>

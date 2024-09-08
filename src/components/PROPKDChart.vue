<template>
  <v-row class="text-center justify-center" dense>
    <v-col
      v-for="cell in scoreGrid"
      :key="cell.value"
      :class="['pa-4', getCellStyle(cell)]"
      class="grid-cell"
      cols="1"
    >
      <div v-bind="attrs" v-on="on">
        {{ cell.value }}
        <v-tooltip activator="parent" location="top">
          {{ cell.label }}: {{ cell.description }}
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      scoreGrid: [
        { value: 0, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 1, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 2, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 3, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 4, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 5, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 6, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 7, label: 'HIGH', description: '49 median age for ESRD onset' },
        { value: 8, label: 'HIGH', description: '49 median age for ESRD onset' },
        { value: 9, label: 'HIGH', description: '49 median age for ESRD onset' },
      ],
    };
  },
  methods: {
    getCellStyle(cell) {
      if (cell.value === this.score) {
        return 'highlight-cell'; // Highlight style for current score
      } else if (cell.value <= 3) {
        return 'low-risk';
      } else if (cell.value >= 3 && cell.value <= 6) {
        return 'intermediate-risk';
      } else {
        return 'high-risk';
      }
    },
  },
};
</script>

<style scoped>
.grid-cell {
  flex-grow: 1;
  flex-basis: 0;
  max-width: 100%;
}

/* Ensures grid stretches fully */
.v-row {
  display: flex;
  justify-content: center;
}

.low-risk {
  background-color: #ffe599;
  border: 1px solid #ccc;
}

.intermediate-risk {
  background-color: #f4b183;
  border: 1px solid #ccc;
}

.high-risk {
  background-color: #e06666;
  border: 1px solid #ccc;
  color: white;
}

.highlight-cell {
  background-color: #ffeb3b !important; /* Highlight the active cell */
  border: 2px solid #000;
  color: #000;
  font-weight: bold;
}

/* Make sure the grid cells are responsive */
.grid-cell {
  width: 100%;
  max-width: 100px; /* Adjust this value based on the size you want for each cell */
  text-align: center;
}
</style>

<template>
  <v-row class="text-center" dense>
    <v-col
      v-for="cell in scoreGrid"
      :key="cell.value"
      :class="['pa-4', getCellStyle(cell)]"
      cols="1"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">{{ cell.value }}</div>
        </template>
        <span>{{ cell.label }}<br />{{ cell.description }}</span>
      </v-tooltip>
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
        { value: 1, label: '', description: '' },
        { value: 2, label: '', description: '' },
        { value: 3, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 4, label: '', description: '' },
        { value: 5, label: '', description: '' },
        { value: 6, label: 'HIGH', description: '49 median age for ESRD onset' },
        { value: 7, label: '', description: '' },
        { value: 8, label: '', description: '' },
        { value: 9, label: '', description: 'Risk of ESRD before 60' },
      ],
    };
  },
  methods: {
    getCellStyle(cell) {
      if (cell.value === this.score) {
        return 'highlight-cell'; // Highlight style for current score
      } else if (cell.value <= 2) {
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
</style>

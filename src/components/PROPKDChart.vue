<template>
  <v-row class="text-center justify-center" dense>
    <v-col
      v-for="cell in scoreGrid"
      :key="cell.value"
      :style="getCellStyle(cell)"
      class="grid-cell"
      cols="1"
    >
      <div>
        {{ cell.value }}
        <v-tooltip activator="parent" location="top">
          {{ cell.label }}: {{ cell.description }}
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import chartConfig from '../config/chartConfig.js'; // Import chartConfig

export default {
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // Load the scoreGrid from the configuration
      scoreGrid: chartConfig.propkdChart.scoreGrid,
    };
  },
  methods: {
    getCellStyle(cell) {
      if (cell.value === this.score) {
        return {
          backgroundColor: chartConfig.propkdChart.highlightColor.backgroundColor,
          borderColor: chartConfig.propkdChart.highlightColor.borderColor,
          borderWidth: chartConfig.propkdChart.highlightColor.borderWidth,
          borderStyle: 'solid',
          color: chartConfig.propkdChart.highlightColor.color,
          fontWeight: chartConfig.propkdChart.highlightColor.fontWeight,
        };
      } else if (cell.value <= 3) {
        return {
          backgroundColor: chartConfig.propkdChart.lowRiskColor.backgroundColor,
          borderColor: chartConfig.propkdChart.lowRiskColor.borderColor,
          borderWidth: chartConfig.propkdChart.lowRiskColor.borderWidth,
          borderStyle: 'solid',
        };
      } else if (cell.value >= 4 && cell.value <= 6) {
        return {
          backgroundColor: chartConfig.propkdChart.intermediateRiskColor.backgroundColor,
          borderColor: chartConfig.propkdChart.intermediateRiskColor.borderColor,
          borderWidth: chartConfig.propkdChart.intermediateRiskColor.borderWidth,
          borderStyle: 'solid',
        };
      } else {
        return {
          backgroundColor: chartConfig.propkdChart.highRiskColor.backgroundColor,
          borderColor: chartConfig.propkdChart.highRiskColor.borderColor,
          borderWidth: chartConfig.propkdChart.highRiskColor.borderWidth,
          borderStyle: 'solid',
          color: chartConfig.propkdChart.highRiskColor.color,
        };
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
  width: 100%;
  max-width: 100px;
  text-align: center;
  min-height: 60px; /* Set a minimum height for cells */
  display: flex;
  align-items: center; /* Vertically center the content */
  justify-content: center; /* Horizontally center the content */
}

.v-row {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <v-app-bar color="secondary" dark fixed>
    <img
      src="/logo.webp"
      alt="ADPKD-Risk Logo"
      class="mx-2 app-logo"
      aria-label="ADPKD Risk Calculator Logo"
    />
    <v-toolbar-title class="d-flex align-center mx-0">
      <h1 class="app-title">
        ADPKD Risk
      </h1>
      <span class="app-version" aria-label="Version {{ version }}">
        v{{ version }}-<span v-if="!fetchError">{{ lastCommitHash }}</span><span v-else>offline</span>
      </span>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Reset Button -->
    <v-btn icon @click="resetForm" aria-label="Reset Form">
      <v-icon>mdi-refresh</v-icon>
      <v-tooltip activator="parent" location="bottom">
        Reset Form
      </v-tooltip>
    </v-btn>

    <!-- Theme Toggle Button -->
    <v-btn icon @click="toggleTheme" :aria-label="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme' }}
      </v-tooltip>
    </v-btn>

    <!-- FAQ Button -->
    <v-btn icon @click="openFAQ" aria-label="Open FAQ">
      <v-icon>mdi-help-circle</v-icon>
      <v-tooltip activator="parent" location="bottom">
        How to Use & FAQ
      </v-tooltip>
    </v-btn>

    <!-- Print as PDF Button -->
    <v-btn icon @click="printAsPDF" aria-label="Print as PDF">
      <v-icon>mdi-printer</v-icon>
      <v-tooltip activator="parent" location="bottom">
        Print as PDF
      </v-tooltip>
    </v-btn>
  </v-app-bar>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  props: {
    version: String,
    lastCommitHash: String,
    fetchError: Boolean,
    isDark: Boolean
  },
  methods: {
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    resetForm() {
      this.$emit('reset-form');
    },
    openFAQ() {
      this.$emit('open-faq');
    },
    async printAsPDF() {
      try {
        const appElement = document.querySelector('#app-content'); // Updated to target 'app-content'

        if (!appElement) {
          console.error('App content element not found');
          return;
        }

        const canvas = await html2canvas(appElement, {
          scale: 2,
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ADPKD_Risk_Report.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  }
};
</script>

<style scoped>
.app-logo {
  max-width: 48px;
  margin-right: 20px;
}

.app-title {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
}

.app-version {
  color: #e0e0e0;
}
</style>

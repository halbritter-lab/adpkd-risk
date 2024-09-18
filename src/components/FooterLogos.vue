<template>
  <v-footer app color="grey lighten-4">
    <v-container class="d-flex justify-center footer-container">
      <a v-for="link in institutionLinks" :key="link.name" :href="link.url" target="_blank">
        <img :src="link.logo" :alt="link.name" class="logo" />
      </a>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      institutionLinks: [
        {
          name: 'CeRKiD',
          url: 'https://nephrologie-intensivmedizin.charite.de/fuer_patienten/cerkid/',
          logo: 'CeRKiD_175x130.jpg',
          alt: 'CeRKiD Logo',
        },
        {
          name: 'DFG',
          url: 'https://www.dfg.de/en/',
          logo: 'dfg_logo_schriftzug_schwarz_foerderung_en.gif',
          alt: 'DFG Logo',
        },
      ],
    };
  },
};
</script>

<style scoped>
.footer-container {
  padding: 0px 0;
}

.logo {
  max-width: 120px; /* Maximum width for logos */
  padding: 0px; /* Padding around logos */
  margin: 0 10px; /* Spacing between logos */
  max-height: 40px; /* Maximum height for logos */
}
</style>

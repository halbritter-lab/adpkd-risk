// src/main.js

import { createApp } from 'vue';
import App from './App.vue';

// Import the Vuetify plugin
import vuetify from './plugins/vuetify'; 

import { loadFonts } from './plugins/webfontloader';

loadFonts();

createApp(App)
  .use(vuetify) // Use the Vuetify plugin
  .mount('#app');

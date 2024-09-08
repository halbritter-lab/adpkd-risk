// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import { APP_CONFIG } from './config';  // Import the configuration

loadFonts();

const app = createApp(App)
  .use(vuetify);

// Dynamically set the browser tab title from config
document.title = APP_CONFIG.title;

app.mount('#app');

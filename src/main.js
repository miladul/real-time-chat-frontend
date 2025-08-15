import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Tell Vue to use Pinia
app.use(pinia);

app.mount('#app');

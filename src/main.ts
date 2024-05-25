import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/styles/style.css';
import App from './App.vue';
import router from './router';
import { store } from './store';

const app = createApp(App);

app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount('#app');

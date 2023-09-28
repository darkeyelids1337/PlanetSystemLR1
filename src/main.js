import { createApp } from 'vue'
import Tres from '@tresjs/core'
import App from './App.vue'
import store from './store/index';

const app = createApp(App);
app.use(store)
app.use(Tres)
app.mount('#app')

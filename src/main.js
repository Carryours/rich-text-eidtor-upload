import './assets/main.css'
import "quill/dist/quill.core.css";

import { createApp } from 'vue'
import App from './App.vue'
// import App from './views/RichEditor.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

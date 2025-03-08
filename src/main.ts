import './assets/css/index.less'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router} from './router'
import "./permission.ts"
import 'virtual:windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import permission from '@/direactives/permission.ts'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)

app.use(permission)
app.mount('#app')


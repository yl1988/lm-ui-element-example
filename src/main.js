import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import LmUiElement from 'lm-ui-element'
import 'lm-ui-element/lib/lm-ui-element-style/index.css'
import $lm from 'lm-ui-element/lib/utils/$lm'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(LmUiElement)
Vue.use($lm)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

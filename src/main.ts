// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Fant from 'fant'
import 'fant/lib/theme/index.css'
import Prototype from 'cmd/Prototype.js'
import Filter from 'cmd/Filter.js'
import './assets/iconfont/iconfont.css'
import './assets/styles/qfbutton.css'
import './assets/styles/typedefSkin.css'

Prototype.init()
Filter.init()
Vue.config.productionTip = false
Vue.use(Fant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGoogleCharts from 'vue-google-charts'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDfaNlbsN8-AF5Hw4YT6T3kLdeOtl5kTjg',
    libraries: 'drawing,visualization',
  },
  autobindAllEvents: true
})

Vue.use(VueGoogleCharts)

Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'localhost:8001' // TODO: Change

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import App from './App'
import router from './router'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    router.push({path: '/login'})
  }
  return Promise.reject(error)
})
Vue.prototype.$http = axios

const store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    put_user (state, user) {
      state.user = user
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.use(ElementUI)

Vue.filter('goodsDate', function (input) {
  return moment().format('YYYY-MM-DD HH:mm:ss')
})
Vue.prototype.axios = axios
// 引入element-ui
// 拦截器
/* eslint-disable */
axios.interceptors.request.use(function (config) {
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('myToken')
  return config
}), function (error) {
  return Promise.reject(error)
}

// 配置基础路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

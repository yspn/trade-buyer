// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import { sysStore } from './vuex/SysStore'
import { apiStore } from './vuex/APIStore'
import { userStore } from './vuex/UserStore'
import { messageStore } from './vuex/MessageStore'
import { orderStore } from './vuex/OrderStore'
import {
  focusOrCreateTab
} from '../static/common'

let appKey = '17'

Vue.use(Vuex)
Vue.use(iView)
Vue.prototype.$http = axios
axios.defaults.withCredentials = true
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (userStore.state.user.token && config.data) { // 判断是否存在token，如果存在的话，则每个http data都加上token
    //   // config.headers.Authorization = `token ${store.state.token}`
    //   let dataObj = config.data
    //   dataObj.token = userStore.state.user.token
    //   config.data = dataObj
    // }
    iView.LoadingBar.start()
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器

axios.interceptors.response.use(
  response => {
    iView.LoadingBar.finish()
    return response
  },
  error => {
    if (error.response) {
      iView.LoadingBar.error()
      switch (error.response.status) {
        case 401:
          // router.push({ path: '/login' })
          let localUrl = window.chrome.extension ? window.chrome.extension.getURL('/') + 'controls.html' : 'http://localhost:8080/'
          var url = window.encodeURIComponent(localUrl + '#/login')
          if (window.chrome.extension) {
            focusOrCreateTab('http://login.tao11.la/login.html?redirect_uri=' + url + '&appkey=' + appKey)
          } else {
            window.open('http://login.tao11.la/login.html?redirect_uri=' + url + '&appkey=' + appKey, '_blank')
          }
          iView.Notice.error({
            title: '您还未登录，请先登录',
            desc: ''
          })
          break
        case 403:
          iView.Notice.error({
            title: '您没有访问该资源的权限！',
            desc: ''
          })
          router.back()
          break
        case 406:
          iView.Notice.error({
            title: '您没有访问该资源的权限！',
            desc: ''
          })
          router.back()
          break
      }
    }
    // 返回接口返回的错误信息
    return Promise.reject(error.response && error.response.data ? error.response.data : error)
  }
)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

const store = new Vuex.Store({
  modules: {
    SysStore: sysStore,
    APIStore: apiStore,
    UserStore: userStore,
    MessageStore: messageStore,
    OrderStore: orderStore
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

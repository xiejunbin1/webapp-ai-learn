/*
 * @Author: wgj
 * @Date: 2021-03-22 10:26:34
 * @LastEditTime: 2021-04-21 20:26:35
 * @LastEditors: wgj
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/icons' // icon
import Vconsole from 'vconsole';
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

import Vant from 'vant';
import 'vant/lib/index.css';
// 引入全部样式
import 'vant/lib/index.less';
import "assets/css/reset.less";
import { hex_md5 } from "@/utils/md5";

import * as filters from './filters' // 全局过滤器

import 'element-ui/lib/theme-chalk/index.css'
import { Tree } from 'element-ui'
import axios from "./utils/request"
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import moment from "moment";

Vue.use(Tree)//按需引入element-ui


Vue.use(Vant);

Vue.prototype.$hex_md5 = hex_md5//挂载到Vue实例上面

Vue.prototype.$moment = moment//挂载到Vue实例上面

import './permission' // permission control

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

function version(response) {
  // let baseurl = window.location.origin + "/version.json"
  // axios.get(baseurl)
  //   .then(function (response) {
      console.log("response", response)
      if (localStorage.hasOwnProperty("version")) {
        if (localStorage.getItem("version") != response.version) {
          localStorage.setItem("version", response.version)
          window.location.reload();
        }
      } else {
        localStorage.setItem("version", response.version)
        window.location.reload();
      }

    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
}

Vue.prototype.$version = version






//集成环境或者正式环境才收集错误信息
// import * as fundebug from "fundebug-javascript";
// import fundebugVue from "fundebug-vue";
// if (process.env.NODE_ENV == "production"|| process.env.NODE_ENV == "sit") {
//   fundebug.init({
//     apikey: "c34f2bef2d5eb9b0602c258636082bd31453e96f40a837de256cd9e289bcee50",
//     silentDev: false,
//     silentConsole: true
//   })
//   fundebugVue(fundebug, Vue);
// }
//  else if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "sit") {
//   const vConsole = new Vconsole();
//   Vue.use(vConsole)
// }
  // const vConsole = new Vconsole();
  // Vue.use(vConsole)

// 移动端适配
// import 'lib-flexible/flexible.js'


Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



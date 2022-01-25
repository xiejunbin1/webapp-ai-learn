/*
 * @Author: wgj
 * @Date: 2021-03-25 17:29:22
 * @LastEditTime: 2021-04-21 17:20:13
 * @LastEditors: wgj
 * @Description: 
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
Vue.use(VueRouter)
const files = require.context('./modules', false, /\.js$/)
let routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      showMenu: true,
      index:0,
      title:'首页',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/login/login"),
    meta: {
      showMenu: false,
      title:'登录',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/views/login/register"),
    meta: {
      showMenu: false,
      title:'注册',
    },
  },
  {
    path: '/retrievePassword',
    name: 'retrievePassword',
    component: () => import("../views/mine/retrievePassword.vue"),
    meta: {
        showMenu: false,
        title: '忘记密码'
    },
  },
  {
    path: '/aaa',
    name: 'aaa',
    component: () => import("../views/personalCenter/aaa.vue"),
    meta: {
        showMenu: false,
        title: '忘记密码'
    },
  }
]
files.keys().forEach(key => {
  const tmp = files(key).default
  console.log(files(key).default)
  routes = routes.concat(...tmp)
})
console.log(routes)

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: routes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router

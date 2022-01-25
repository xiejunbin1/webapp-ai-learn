/*
 * @Author: wgj
 * @Date: 2021-03-25 17:29:22
 * @LastEditTime: 2021-03-26 19:28:55
 * @LastEditors: wgj
 * @Description: 
 */

const demoRouter = [{
    path: '/demo',
    name: 'About',
    component: () => import("@/views/About"),
    meta: {
        showMenu: true,
    },
}]

export default demoRouter
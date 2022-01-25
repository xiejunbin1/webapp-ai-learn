/*
 * @Author: xjb
 * @Date: 2021-04-02 10:05
 * @LastEditTime: 
 * @LastEditors: xjb
 * @Description: 
 */

const mineRouter = [
    {
        path: '/personalCenter',
        name: 'personalCenter',
        component: () => import("../../views/personalCenter/information.vue"),
        meta: {
            showMenu: false,
            title: '个人信息'
        },
    },
    {
        path: '/selectTheCity',
        name: 'selectTheCity',
        component: () => import("../../views/personalCenter/selectTheCity.vue"),
        meta: {
            showMenu: false,
            title: '选择城市'
        },
    },
]

export default mineRouter
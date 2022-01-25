/*
 * @Author: wgj
 * @Date: 2021-03-25 17:29:22
 * @LastEditTime: 2021-04-21 17:21:28
 * @LastEditors: wgj
 * @Description: 
 */

const mineRouter = [
    {
        path: '/mine',
        name: 'mine',
        component: () => import("@/views/mine/index"),
        meta: {
            showMenu: true,
            index:1,
            title:'我的',
        },
    },
    {
        path: '/setUp',
        name: 'setUp',
        component: () => import("@/views/mine/setUp"),
        meta: {
            showMenu: false,
            title:'设置',
        },
    },
    {
        path: '/accountManage',
        name: 'accountManage',
        component: () => import("@/views/mine/accountManage"),
        meta: {
            showMenu: false,
            title:'账号管理',
        },
    },
    {
        path: '/opinion',
        name: 'opinion',
        component: () => import("@/views/mine/opinion"),
        meta: {
            showMenu: false,
            title:'意见反馈',
        },
    },
    {
        path: '/about',
        name: 'about',
        component: () => import("@/views/mine/about"),
        meta: {
            showMenu: false,
            title:'关于我们',
        },
    },
    {
        path: '/secretPolicy',
        name: 'secretPolicy',
        component: () => import("@/views/mine/secretPolicy"),
        meta: {
            showMenu: false,
            title:'隐私政策',
        },
    },
    {
        path: '/diagnosticRecord',
        name: 'diagnosticRecord',
        component: () => import("../../views/mine/diagnosticRecord.vue"),
        meta: {
            showMenu: false,
            title: '诊断记录'
        },
    },
    {
        path: '/learningRecord',
        name: 'learningRecord',
        component: () => import("../../views/mine/learningRecord.vue"),
        meta: {
            showMenu: false,
            title: '学习记录'
        },
    },
    {
        path: '/practiceRecord',
        name: 'practiceRecord',
        component: () => import("../../views/mine/practiceRecord.vue"),
        meta: {
            showMenu: false,
            title: '练习记录'
        },
    },
    {
        path: '/testRecord',
        name: 'testRecord',
        component: () => import("../../views/mine/testRecord.vue"),
        meta: {
            showMenu: false,
            title: '测试记录'
        },
    },
    {
        path: '/changePassword',
        name: 'changePassword',
        component: () => import("../../views/mine/changePassword.vue"),
        meta: {
            showMenu: false,
            title: '修改密码'
        },
    },
    
    
    
]

export default mineRouter
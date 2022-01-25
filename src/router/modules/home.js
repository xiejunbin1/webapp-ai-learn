/*
 * @Author: wgj
 * @Date: 2022-04-20 24:04:58
 * @LastEditTime: 2021-04-21 17:18:14
 * @LastEditors: wgj
 * @Description: 
 */
const homeRouter = [
    {
        path: '/judgeLearningSubject',
        name: 'judgeLearningSubject',
        component: () => import("@/views/judge/judgeLearningSubject"),
        meta: {
            showMenu: false,
            title:'诊断学情'
        },
    },
    {
        path: '/judgeLearningTextbook',
        name: 'judgeLearningTextbook',
        component: () => import("@/views/judge/judgeLearningTextbook"),
        meta: {
            showMenu: false,
            title:'诊断学情'
        },
    },
    {
        path: '/judgeLearningSection',
        name: 'judgeLearningSection',
        component: () => import("@/views/judge/judgeLearningSection"),
        meta: {
            showMenu: false,
            title:'诊断学情'
        },
    },
    {
        path: '/judgeLearningTitle',
        name: 'judgeLearningTitle',
        component: () => import("@/views/judge/judgeLearningTitle"),
        meta: {
            showMenu: false,
            title:'诊断学情'
        },
    },
    {
        path: '/judgeReport',
        name: 'judgeReport',
        component: () => import("@/views/judge/judgeReport"),
        meta: {
            showMenu: false,
            title:'诊断报告'
        },
    },
    {
        path: '/examAnalysis',
        name: 'examAnalysis',
        component: () => import("@/views/judge/examAnalysis"),
        meta: {
            showMenu: false,
            title:'题目解析'
        },
    },
]

export default homeRouter
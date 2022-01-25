const learningCenter = [
    {
        path: '/learningCenter',
        name: 'learningCenter',
        component: () => import("../../views/learningCenter/learningCenter.vue"),
        meta: {
            showMenu: false,
            title: '学习中心'
        },
    },
    {
        path: '/switchVersion',
        name: 'switchVersion',
        component: () => import("../../views/learningCenter/switchVersion.vue"),
        meta: {
            showMenu: false,
            title: '教材选择'
        },
    },
    {
        path: '/videoPractice',
        name: 'videoPractice',
        component: () => import("../../views/learningCenter/videoPractice.vue"),
        meta: {
            showMenu: false,
            title: '微课学习'
        },
    },
    
]

export default learningCenter
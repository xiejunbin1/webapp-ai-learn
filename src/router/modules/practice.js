const practice = [
    {
        path: '/practiceList',
        name: 'practiceList',
        component: () => import("@/views/practice/practiceList.vue"),
        meta: {
            showMenu: false,
            title:'练习基地',
        },
    },
    {
        path: '/togetherPractice',
        name: 'togetherPractice',
        component: () => import("@/views/practice/togetherPractice.vue"),
        meta: {
            showMenu: false,
            title:'同步练习',
        },
    },
    {
        path: '/practiceResult',
        name: 'practiceResult',
        component: () => import("@/views/practice/practiceResult.vue"),
        meta: {
            showMenu: false,
            title:'练习结果',
        },
    },
]

export default practice
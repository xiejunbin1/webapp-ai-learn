const testList = [
    {
        path: '/testList',
        name: 'testList',
        component: () => import("@/views/testRoom/testList.vue"),
        meta: {
            showMenu: false,
            title:'测试基地',
        },
    },
    {
        path: '/testReport',
        name: 'testReport',
        component: () => import("@/views/testRoom/testReport.vue"),
        meta: {
            showMenu: false,
            title:'测试报告',
        },
    },
]

export default testList
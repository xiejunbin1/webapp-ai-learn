<template>
<div class='' style="background: #f8f8f8;min-height: 100vh">
    <van-nav-bar fixed placeholder z-index="201" title="诊断学情" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='onClickLeft' />
            <svg-icon class="fs17" icon-class="icon-cross" @click="goToHome" />
        </template>
    </van-nav-bar>
    <div class="section-content" v-if="(bookCourseListTermT01 && bookCourseListTermT01.length>0) || (bookCourseListTermT02 && bookCourseListTermT02.length>0)">
        <div class='choose'>请选择章节</div>
        <div>
            <div class="textbook-name">
                <div class='left'>
                    <div class="circle"></div>
                    <span>{{query.textBookName}}</span>
                    <span>{{getUserProfileInfo.grade | getGradeName}}</span>
                    <span>{{termT01Obj.termTypeName}}</span>
                </div>
                <div @click="showCatalog('termT01Obj')">
                    <span>折叠目录</span>
                    <svg-icon :icon-class="termT01Obj.isShow?'icon-arrow-up-blue':'icon-arrow-down-blue'"></svg-icon>
                </div>
            </div>
            <el-tree ref="tree1" :default-checked-keys="checkedKeys1" :expand-on-click-node="false" :check-on-click-node="true" class="mgb15" v-if="termT01Obj.refreshTree" :default-expand-all="termT01Obj.isShow" :data="bookCourseListTermT01" :current-node-key="termT01Obj.chooseNode" @check="checkedNodesTermT01" show-checkbox node-key="nodeId" :props="defaultProps">
            </el-tree>
        </div>
        <div>
            <div class="textbook-name">
                <div class='left'>
                    <div class="circle"></div>
                    <span>{{query.textBookName}}</span>
                    <span>{{getUserProfileInfo.grade | getGradeName}}</span>
                    <span>{{termT02Obj.termTypeName}}</span>
                </div>
                <div @click="showCatalog('termT02Obj')">
                    <span>折叠目录</span>
                    <svg-icon :icon-class="termT02Obj.isShow?'icon-arrow-up-blue':'icon-arrow-down-blue'"></svg-icon>
                </div>
            </div>
            <el-tree ref="tree2" :default-checked-keys="checkedKeys2" :expand-on-click-node="false" :data="bookCourseListTermT02" v-if="termT02Obj.refreshTree" :default-expand-all="termT02Obj.isShow" @check="checkedNodesTermT02" show-checkbox node-key="nodeId" :props="defaultProps">
            </el-tree>
        </div>
    </div>
    <div class='button' v-if="(bookCourseListTermT01 && bookCourseListTermT01.length>0) || (bookCourseListTermT02 && bookCourseListTermT02.length>0)">
        <van-button round block type="info" :loading="submitBtnLoading" @click="toJudge">立即诊断</van-button>
    </div>
    <NoResult class='all-center' v-else></NoResult>
    <van-action-sheet v-model="showType" title="选择章节在校成绩">
        <div style='padding: 15px'>
            <van-button class='mgb10' round block plain type="info" v-for="(item,index) in typeList" :key="index" @click="sureType(item)">{{item.value}}</van-button>
        </div>
    </van-action-sheet>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getTextBookCourseList
} from "@/api/resource"
import {
    getUserLearningInfo
} from "@/api/counter"
import {
    createDiagnosisTask
} from "@/api/teach"
import {
    arrToTree
} from '@/utils/arrToTree.js'
import NoResult from "@/components/NoResult"
import {
    getSubjectName,
    getGradeName,
} from "@/utils/filter";
// import {
//     getSubjectName,
//     getGradeName
// } from "@/utils/filter.js"
    export default {
        name: '',
        components: {
            NoResult
        },
    data() {
        return {
            bookCourseList: [],
            query: {},
            defaultProps: {
                children: 'children',
                label: 'nodeName'
            },
            bookCourseListTermT01: [],
            bookCourseListTermT02: [],
            termT01Obj: {
                termTypeName: '',
                isShow: true,
                refreshTree: true
            },
            termT02Obj: {
                termTypeName: '',
                isShow: true,
                refreshTree: true
            },
            sysCourseIdListT01: [], //上册勾选的课程 提交的时候只有一个不为空即可
            sysCourseIdListT02: [], //下册勾选的课程
            submitBtnLoading: false,
            showType: false,
            typeList: [{
                    value: '90-100分',
                    key: '95', //这里取值只要取90-100之间的随机数即可，先取中间的数
                },
                {
                    value: '80-90分',
                    key: '85',
                },
                {
                    value: '70-80分',
                    key: '75',
                },
                {
                    value: '60-70分',
                    key: '65',
                },
                {
                    value: '60分以下',
                    key: '55',
                },
            ],
            diffLevel: 0,
            checkedKeys1: [], //上册默认选中的keys组合
            checkedKeys2: [], //下册默认选中的keys组合
            
        };
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    watch: {},

    created() {

    },
    mounted() {
        this.query = this.$route.query || {}
        this.getTextBookCourseList();
    },

    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {
        console.log('activated')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeRouteEnter(to, from, next) {
        console.log(to, from)

        next(vm => {
            if (from.query && from.query.checkedKeys1) {
                vm.checkedKeys1 = from.query.checkedKeys1
            }
            if (from.query && from.query.checkedKeys2) {
                vm.checkedKeys2 = from.query.checkedKeys2
            }
        })
    },
    methods: {
        //获取章节课程
        getTextBookCourseList() {
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "gradeTermId": '',
                "subjectType": this.query.subjectType,
                "textBookId": this.query.textBookId,
                "classGrade": this.getUserProfileInfo.grade
            }
            getTextBookCourseList(params).then(res => {
                if (res.flag) {
                    let list = res.data || [];
                    if (list[0]) {
                        this.bookCourseListTermT01 = arrToTree(list[0].bookCourseList, 'nodeId', 'parentId')[0].children;
                        this.bookCourseListTermT01.forEach(value => {
                            if (value.children) {
                                value.children.sort(function (a, b) {
                                    return a.indexNo - b.indexNo;
                                })
                            }
                        })
                        console.log('上册', JSON.parse(JSON.stringify(this.bookCourseListTermT01)));
                        this.termT01Obj.termTypeName = list[0].termTypeName
                    }
                    if (list[1]) {
                        this.bookCourseListTermT02 = arrToTree(list[1].bookCourseList, 'nodeId', 'parentId')[0].children;
                        this.bookCourseListTermT02.forEach(value => {
                            if (value.children) {
                                value.children.sort(function (a, b) {
                                    return a.indexNo - b.indexNo;
                                })
                            }
                        })
                        console.log('下册', JSON.parse(JSON.stringify(this.bookCourseListTermT02)));
                        this.termT02Obj.termTypeName = list[1].termTypeName
                    }
                }
            })
        },
        //折叠目录
        showCatalog(item) {
            this[item].isShow = !this[item].isShow;
            //以下是为了解决展开折叠需重新渲染问题
            this[item].refreshTree = false;
            this.$nextTick(() => {
                this[item].refreshTree = true
            })
        },
        //勾选（上册）
        checkedNodesTermT01(item, obj) {
            this.checkedKeys1 = obj.checkedKeys
            this.checkedNodes(item, obj, 'tree1', 'bookCourseListTermT01', 'bookCourseListTermT02')
            this.sysCourseIdListT01 = obj.checkedNodes
        },
        //勾选（下册）
        checkedNodesTermT02(item, obj) {
            this.checkedKeys2 = obj.checkedKeys
            this.checkedNodes(item, obj, 'tree2', 'bookCourseListTermT02', 'bookCourseListTermT01')
            this.sysCourseIdListT02 = obj.checkedNodes
        },
        checkedNodes(item, obj, refName, listName1, listName2) {
            console.log(6666, item, obj)
            let checked = false
            if (obj.checkedKeys.includes(item.nodeId)) {
                checked = true
            }
            let nodeItem = this.$refs[refName].getNode(item.nodeId)
            this.handleTreePro(item, nodeItem, refName, obj.checkedKeys, listName1, listName2)
        },
        //勾选时禁用其他章节，以及重新选中节点
        handleTreePro(data, node, refName, checkedKeys, listName1, listName2) {
            console.log(777, data, node, checkedKeys, listName1, listName2)
            let obj = {} //顶层节点
            if (node.level == 1) {
                obj.data = {},
                    obj.data.nodeId = data.nodeId
            } else {
                for (let i = 0; i < node.level - 1; i++) {
                    if (!i) {
                        obj = node.parent
                    } else {
                        obj = obj.parent
                    }
                }
            }
            console.log('顶层节点', obj)
            // if(obj.data.nodeName){
            //     this.sectionName = obj.data.nodeName
            // }else{//直接勾选顶层节点时会获取不到，需直接从该node里面获取
            //     this.sectionName = node.data.nodeName
            // }
            this.sectionNodeId = obj.data.nodeId
            console.log(this.sectionNodeId)
            //当有节点被勾选，则要禁用其余节点
            let status = false
            if (checkedKeys && checkedKeys.length > 0) {
                status = true
            }
            //当前树里其他章节禁用/不禁用
            this.disabledNodes(listName1, obj, status, false)
            //另外一棵树所有章节禁用/不禁用
            //status&&true 是否禁用，当当前没有节点勾选则为false，不禁用，否则禁用
            this.disabledNodes(listName2, obj, status && true, true)
            this[listName1] = JSON.parse(JSON.stringify(this[listName1]))
            this[listName2] = JSON.parse(JSON.stringify(this[listName2]))
            //手动重新勾选上，不然刷新数据勾选的会取消
            this.$refs[refName].setCheckedKeys(checkedKeys)
            if(obj.data.nodeId == node.key) return
            setTimeout(() => {
                this.$refs[refName].store.nodesMap[data.parentId].expanded = true
            })
            // console.log('最外层父级数据：', obj.data)
        },
        disabledNodes(listName, obj, status, isAll) {
            //另外一棵树所有章节禁用
            // console.log('listName',listName,isAll)
            this[listName].forEach((item, index) => {
                if ((item.nodeId != obj.data.nodeId && !isAll) || isAll) {
                    item.disabled = status
                    searchNode(item)
                }

                function searchNode(obj) {
                    if (obj.children && obj.children.length > 0) {
                        obj.children.forEach(objItem => {
                            objItem.disabled = status;
                            searchNode(objItem)
                        })
                    }
                }
            })
        },
        toJudge() {
            if (this.sysCourseIdListT01.length <= 0 && this.sysCourseIdListT02.length <= 0) {
                return this.$toast('请先勾选章节！')
            }
            this.courseList = [];
            if (this.sysCourseIdListT01.length > 0) {
                this.courseList = this.getCourseList(this.sysCourseIdListT01)
                this.termTypeName = '上册'
            }
            if (this.sysCourseIdListT02.length > 0) {
                this.courseList = this.getCourseList(this.sysCourseIdListT02)
                this.termTypeName = '下册'
            }
            if (this.courseList.length <= 0) {
                return this.$toast('当前选择的章节未绑定课程，请重新选择！')
            }
            console.log('课程数组')
            console.log(JSON.parse(JSON.stringify(this.courseList)));
            this.getUserLearningInfo({
                success: (res) => {
                    this.diffLevel = res.data
                    this.createDiagnosisTask()
                }
            })
        },
        //创建诊断任务
        createDiagnosisTask() {
            //命名规则：年级学科+诊断+年月日时分
            const taskName = getGradeName(this.getUserProfileInfo.grade) + getSubjectName(this.query.subjectType) + '诊断' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": this.query.subjectType,
                "classGrade": this.getUserProfileInfo.grade,
                "termType": this.sysCourseIdListT01.length > 0 ? 'T01' : 'T02',
                "sysCourseIdList": this.courseList,
                "examRuleList": [{
                    "type": "T01", //选择题
                    "cnt": 20, //20道
                    "score": 5 //每道5分
                }],
                "shareType": 'S03',
                "diffLevel": this.diffLevel,
                "duration": 9999, //写死
                "taskName": taskName,
                "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: this.sectionNodeId
                    },
                    {
                        resourceType: 'R98', //版本
                        resourceId: this.query.textBookId
                    },
                ]
            }
            createDiagnosisTask(params).then(res => {
                if (res.flag) {
                    let query = {
                        taskId: res.data.taskId,
                        tchCourseId: res.data.tchCourseId,
                        checkedKeys1: this.checkedKeys1, //返回当前页勾选回显使用
                        checkedKeys2: this.checkedKeys2, //返回当前页勾选回显使用
                    }
                    this.$router.push({
                        path: '/judgeLearningTitle',
                        query: query
                    })
                } else {
                    let msg = res.msg || '创建失败';
                    this.$toast(msg)
                }
            })
        },
        sureType(item) {
            this.diffLevel = item.key;
            this.showType = false;
            this.createDiagnosisTask()
        },
        //获取courseId组成的数组
        getCourseList(list = []) {
            if (!list || list.length <= 0) return;
            let newList = [];
            list.forEach(item => {
                if (item.courseId != 0) {
                    newList.push(item.courseId)
                }
            })
            return newList;
        },
        getUserLearningInfo(obj) {
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "sysCourseIdList": this.courseList,
            }
            getUserLearningInfo(params).then(res => {
                if (res.flag) {
                    if (res.data == -1) {
                        this.showType = true;
                    } else {
                        obj.success && obj.success(res)
                    }
                } else {
                    this.$toast(res.msg)
                }
            })
        },

        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                    title: '',
                    message: `确定退出诊断学情吗？`,
                    // width: 300,
                    theme: 'round-button',
                })
                .then(async () => {
                    this.$router.replace(`/home`);
                })
                .catch(() => {
                    // on cancel
                });
        },
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
    },
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.section-content {
    padding: 0 15px 75px 15px;

    .choose {
        margin: 25px 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
    }
    .textbook-name {
        font-size: 16px;
        font-weight: 500;
        line-height: 23px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            display: flex;
            align-items: center;
        }
        .circle {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #D8D8D8;
            margin-right: 10px;
        }
    }
    .box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .section-item {
            width: 105px;
            height: 90px;
            border: 1px solid #DDDDDD;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .name {
                // color: #333;
                font-size: 16px;
                font-weight: 500;
                line-height: 23px;
            }
        }
        .active {
            border: 1px solid #4F77EC;
            background: #EFF3FF;
            color: #4F77EC;
        }
    }
    .box::after {
        content: '';
        width: 30%;
    }
    /deep/.el-tree {
        background: #f8f8f8;
        &.el-tree-node {
            padding: 20px 15px;
        }
    }
    /deep/.el-tree>.el-tree-node {
        padding: 20px 15px 10px 15px;
        margin-bottom: 15px;
    }
    /deep/.el-tree-node {
        border-radius: 10px;
        background: #fff;
    }
    /deep/.el-tree-node__content {
        margin-bottom: 10px;
        font-size: 15px;
        font-weight: 500;
        line-height: 21px;
        .el-tree-node__label {
            font-size: 15px;
            color: #333;
        }

    }
    /deep/.el-tree-node__children {
        .el-tree-node__label {
            font-size: 13px;
            color: #666;
        }
    }
}
.button {
    z-index: 200;
    position: fixed;
    bottom: 0;
    margin: 15px;
    // padding: 15px 0;
    width: 345px;
    background: #f8f8f8;
    // opacity: 0.5;
}
</style>

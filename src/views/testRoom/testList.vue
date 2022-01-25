<template>
<div style="background: #f8f8f8;min-height: 100vh; ">
    <ChooseTextBook :subjectActiveIndex.sync="active" :subjectList="subjectList" :textBookObj="textBookObj" @onClickLeft="onClickLeft" @changeSubject="changeSubject" @switchVersion="switchVersion">
        <div slot="content">
            <unitTestList :unitTestList="unitTestList" @goToTest="goToTest" @goToVideo="goToVideo"></unitTestList>
        </div>
    </ChooseTextBook>
    <NoResult class="all-center" v-if="!subjectList || subjectList.length<=0 && !unitTestList || unitTestList.length<=0"></NoResult>
    <NoResult class="all-center" v-else-if="!subjectList || subjectList.length<=0"></NoResult>
    <NoResult class="mgt30" v-else-if="!unitTestList || unitTestList.length<=0"></NoResult>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getGradeSubjectTypeRelationList
} from "@/api/resource"
import {
    getUserPracticeInfoList,
    createHuiXueTask
} from "@/api/teach"
import {
    arrToTree
} from '@/utils/arrToTree.js'
import ChooseTextBook from "@/components/ChooseTextBook"
import NoResult from "@/components/NoResult"
import unitTestList from './components/unitTestList'
import {
    getSubjectName,
    getGradeName,
    changeTheTeachingPicture
} from "@/utils/filter";
import {
    setTimeout
} from 'timers';
export default {
    components: {
        ChooseTextBook,
        NoResult,
        unitTestList
    },
    data() {
        return {
            active: 0,
            grade: '',
            subjectList: [],
            subjectTypeName: '语文',
            score: 3,
            show: false,
            unitTestList: [{
                title: '第一单元',
                unitTesshow: true,
                unitTest: '单元测试',
                difficultyList: [{
                    difficulty: '难度',
                    testStatus: '开始测试',
                    taskId: 12617,
                    tchCourseId: '4590',
                    learningStatus: 1, //1.开始测试   2.继续测试   3.从新测试
                }, {
                    difficulty: '难度',
                    testStatus: '继续测试',
                    learningStatus: 2
                }, {
                    difficulty: '难度',
                    testStatus: '重新测试',
                    learningStatus: 3
                }, ]
            }, {
                title: '第二单元',
                unitTesshow: false,
                unitTest: '单元测试',
                difficultyList: []
            }, {
                title: '第三单元',
                unitTesshow: true,
                unitTest: '单元测试',
                difficultyList: [{
                    difficulty: '难度',
                    testStatus: '开始测试',
                    learningStatus: 1, //1.开始测试   2.继续测试   3.从新测试
                }, {
                    difficulty: '难度',
                    testStatus: '继续测试',
                    learningStatus: 1, //1.开始测试   2.继续测试   3.从新测试
                }, {
                    difficulty: '难度',
                    testStatus: '重新测试',
                    learningStatus: 1, //1.开始测试   2.继续测试   3.从新测试
                }, ]
            }],
            isActive: true,
            isSort: false,
            three: false,
            textBookObj: {}, //版本信息，学科等信息
            url: '',
            tabSubjectType: ''
        }
    },
    mounted() {
        // if(Object.keys(this.textBookObj).length<=0){
        //     return this.$toast('请选择教材课程版本')
        // }
        this.unitTestList = []
        if (this.tabSubjectType) {

        }
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
            this.getGradeSubjectTypeRelationList()
        }

    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    beforeRouteEnter(to, from, next) {
        console.log(to, from)

        next(vm => {
            if (from.query && from.query.subjectType) {
                vm.tabSubjectType = from.query.subjectType
            }
        })
    },
    methods: {
        goToVideo(item) {
            console.log(item)
            if (item.resHuiXueResourceRelationVoList && item.resHuiXueResourceRelationVoList[0]) {
                this.$router.push({
                    name: 'videoPractice',
                    query: {
                        subjectType: this.textBookObj.subjectType,
                        id: item.resHuiXueResourceRelationVoList[0].objectId
                    }
                })
            } else {
                this.$toast('暂无微课信息')
            }
        },
        
        //获取单元测列表
        getUserPracticeInfoList() {
            if (Object.keys(this.textBookObj).length <= 0) return
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "accountNo": this.getUserInfo.accountNo,
                "classGrade": this.textBookObj.classGrade,
                "textBookId": this.textBookObj.textBookId,
                "termType": this.textBookObj.termType,
                "subjectType": this.textBookObj.subjectType,
                "objectType": 'T02' //单元测试
            }
            getUserPracticeInfoList(params).then(res => {
                if (res.flag) {
                    this.unitTestList = [];
                    if (!res.data || res.data.length <= 0) return
                    this.unitTestList = arrToTree(res.data, 'nodeId', 'parentId')[0].children;
                    console.log(JSON.parse(JSON.stringify(this.unitTestList)));
                } else {
                    this.unitTestList = [];
                    this.$toast(res.msg)
                }
            })
        },
        //跳转到测试页面
        goToTest(obj) {
            console.log(JSON.parse(JSON.stringify(obj)));
            this.createHuiXueTask(obj.item, obj.courseItem)

        },
        //创建测试任务
        createHuiXueTask(item, practiceItem) {
            //命名规则：年级学科+测试+年月日时分
            const taskName = getGradeName(practiceItem.classGrade) + getSubjectName(practiceItem.subjectType) + '测试' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": practiceItem.subjectType,
                "classGrade": practiceItem.classGrade,
                "termType": practiceItem.termType,
                "sysCourseIdList": [item.nodeId], //单元测试的时候传章节ID
                "examRuleList": [{
                    "type": "T01", //选择题
                    "cnt": 20, //20道
                    "score": 5 //每道5分
                }],
                "shareType": 'S03',
                "diffLevel": null,
                "degree": practiceItem.courseDegree,
                "duration": 0, //写死
                "taskName": taskName,
                "taskType": 'T24', //练习
                "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: item.nodeId
                    },
                    {
                        resourceType: 'R98', //版本
                        resourceId: this.textBookObj.textBookId
                    },
                ]
            }
            console.log('params', params)
            // return
            createHuiXueTask(params).then(res => {
                if (res.flag) {
                    let query = {
                        taskId: res.data.taskId,
                        tchCourseId: res.data.tchCourseId,
                        pageName: '章节测试'
                    }

                    this.$router.push({
                        path: '/judgeLearningTitle',
                        query: query,
                    })
                } else {
                    let msg = res.msg || '创建失败';
                    this.$toast(msg)
                }
            })
        },
        onClickLeft() {
            // this.$router.go(-1)
            this.$router.push({
                path: '/home'
            })
        },
        // 切换版本
        switchVersion() {
            this.$router.push({
                path: '/switchVersion',
                query: {
                    subjectType: this.subjectList[this.active].subjectType
                }
            })
        },
        changeSubject(title) {
            this.subjectTypeName = title
            console.log(title)
            console.log(this.active)
            let storage = window.localStorage;
            if (storage.textbook) {
                let textBookList = JSON.parse(storage.textbook);
                let textBookIndex = textBookList.map(item => item.subjectTypeName).indexOf(title)
                console.log('textBookIndex', textBookIndex)
                //如果当前学科已缓存了版本信息，则将该版本信息换到缓存第一个
                if (textBookIndex > -1) {
                    [textBookList[0], textBookList[textBookIndex]] = [textBookList[textBookIndex], textBookList[0]]
                    storage.setItem('textbook', JSON.stringify(textBookList))
                    this.textBookObj = textBookList[0]
                } else {
                    this.textBookObj = {}
                }
                // console.log('textBookList', textBookList)
            }
            //如果该版本信息已存在，则直接获取该版本对应的课程数据，否则跳转到选择版本的页面
            if (Object.keys(this.textBookObj).length > 0) {
                this.getUserPracticeInfoList()
            } else {
                this.$router.push({
                    path: '/switchVersion',
                    query: {
                        subjectType: this.subjectList[this.active].subjectType
                    }
                })
            }
        },
        //年级学科信息以及配置信息
        getGradeSubjectTypeRelationList() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "classGrade": this.grade
            }
            getGradeSubjectTypeRelationList(params).then(res => {
                if (res.flag) {
                    this.subjectList = res.data || [];
                    this.refreshTextBook()
                    //初始化tab值
                    if (this.textBookObj && this.textBookObj.subjectType) {
                        for (var i = 0; i < this.subjectList.length; i++) {
                            let item = this.subjectList[i]
                            if (item.subjectType == this.textBookObj.subjectType) {
                                this.active = i
                                this.subjectTypeName = item.subjectTypeName
                                break
                            }
                        }
                    }
                    this.getUserPracticeInfoList()
                }
            })
        },
        refreshTextBook() {
            if(this.subjectList.length > 0){
                try {
                    let storage = window.localStorage;
                    if (storage.getItem("textbook")) {
                        //默认当前学科是缓存第一个
                        this.textBookObj = JSON.parse(storage.getItem("textbook"))[0]
                    }
                    console.log('版本信息、学科等', JSON.parse(JSON.stringify(this.textBookObj)));
                    if (Object.keys(this.textBookObj).length <= 0) {
                        this.$router.push({
                            path: '/switchVersion',
                            query: {
                                subjectType: this.subjectList[this.active].subjectType
                            }
                        })
                    }

                } catch (e) {
                    // debugger
                    this.textBookObj = {}
                    // this.$toast('请选择教材课程版本')
                    // setTimeout(()=>{
                    this.$router.push({
                        path: '/switchVersion',
                        query: {
                            subjectType: this.subjectList[this.active].subjectType
                        }
                    })
                    // },500)
                    console.log(e)
                }
            }
        },
        // 判断当前测试状态
        async learningStatus() {
        }
    },
    watch: {

    },

}
</script>

<style lang="less" scoped>
/deep/.van-tab--active {
    font-weight: 700;
}

/deep/.van-tabs__line {
    background: #fff;
}
</style>

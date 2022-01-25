<template>
<div style="background: #f8f8f8;min-height: 100vh; ">
    <ChooseTextBook :subjectActiveIndex.sync="active" :subjectList="subjectList" :textBookObj="textBookObj" @onClickLeft="onClickLeft" @changeSubject="changeSubject" @switchVersion="switchVersion">
        <div slot="content">
            <courseList :unitTestList="unitTestList" @goToTest="goToTest" @goToVideo="goToVideo"></courseList>
        </div>
    </ChooseTextBook>
    <NoResult class="all-center" v-if="!subjectList || subjectList.length<=0 && !unitTestList || unitTestList.length<=0" ></NoResult>
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
import courseList from './components/courseList'
import {
    getSubjectName,
    getGradeName,
    changeTheTeachingPicture
} from "@/utils/filter";
export default {
    components:{
        ChooseTextBook,
        NoResult,
        courseList
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
                unitName: '第一单元',
                courseList: [{
                    courseName: '春',
                    videoName: '章节名称一',
                    videoImg: '',
                    practiceList: [{
                        type: 'P01',
                        titleDegree: 'D01',
                        taskId: 12617,
                        tchCourseId: '4590',
                    }, {
                        type: 'P02',
                        titleDegree: 'D02'
                    }, {
                        type: 'P03',
                        titleDegree: 'D03'
                    }]
                }]
            }, {
                unitName: '第二单元',
                courseList: [{
                    courseName: '济南的春天',
                    videoName: '章节名称一',
                    videoImg: '',
                    practiceList: null
                }]
            }],
            isActive: true,
            isSort: false,
            three: false,
            practiceUrlP01: require('@/assets/img/practice/practice-P01.png'),
            practiceUrlP02: require('@/assets/img/practice/practice-P02.png'),
            practiceUrlP03: require('@/assets/img/practice/practice-P03.png'),
            textBookObj: {},
            url: '',
            tabSubjectType: ''
        }
    },
    mounted() {
        this.unitTestList=[]
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
            let learningStatus = this.textBookObj.subjectType
            let storage = window.localStorage;
            let textBookList = JSON.parse(storage.textbook);
            let arr = textBookList.find(arr1 => arr1.subjectType == learningStatus)
            let userInfo = this.$store.getters.getUserInfo;
            let classGrade = this.$options.filters.getGradeName(arr.classGrade)
            let termType = arr.termTypeName
            let titleName = `${arr.textBookName}${classGrade}${arr.subjectTypeName}${termType}`
            console.log(titleName,"titleName")
            userInfo.titleName = titleName;
            this.$store.commit('setUserInfo', userInfo)
            // return;
            if (item.courseId && item.resHuiXueResourceRelationVoList && item.resHuiXueResourceRelationVoList.length > 0) {
                this.$router.push({
                    name: 'videoPractice',
                    query: {
                        subjectType: this.textBookObj.subjectType,
                        id: item.courseId //课程ID
                    }
                })
            } else {
                this.$toast('暂无微课信息')
            }
        },
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
                "objectType": 'T01' //练习基地
            }
            getUserPracticeInfoList(params).then(res => {
                if (res.flag) {
                    this.unitTestList=[];
                    if(!res.data || res.data.length<=0)return
                    this.unitTestList = arrToTree(res.data, 'nodeId', 'parentId')[0].children;
                    this.unitTestList.forEach(value => {
                        if (value.children) {
                            value.children.sort(function (a, b) {
                                return a.indexNo - b.indexNo;
                            })
                        }
                    })
                    console.log(JSON.parse(JSON.stringify(this.unitTestList)));
                } else {
                    this.unitTestList = [];
                    this.$toast(res.msg)
                }
            })
        },
        //跳转到测试页面
        goToTest(obj) {
            console.log(obj.item, obj.courseItem, obj.practiceItem)
            this.createHuiXueTask(obj.item, obj.courseItem, obj.practiceItem)
        },
        //创建练习任务
        createHuiXueTask(item, courseItem, practiceItem) {
            //命名规则：年级学科+练习+年月日时分
            const taskName = getGradeName(practiceItem.classGrade) + getSubjectName(practiceItem.subjectType) + '练习' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": practiceItem.subjectType,
                "classGrade": practiceItem.classGrade,
                "termType": practiceItem.termType,
                "sysCourseIdList": [courseItem.courseId],
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
                "taskType": 'T23', //练习
                "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: item.nodeId
                    },
                    // {
                    //     resourceType:'R98',//版本
                    //     resourceId:this.query.textBookId
                    // },
                ]
            }
            // return
            console.log('params', params)
            createHuiXueTask(params).then(res => {
                if (res.flag) {
                    let query = {
                        taskId: res.data.taskId,
                        tchCourseId: res.data.tchCourseId,
                    }
                    this.$router.push({
                        path: '/togetherPractice',
                        query: query
                    })
                } else {
                    let msg = res.msg || '创建失败';
                    this.$toast(msg)
                }
            })
        },
        onClickLeft() {
            this.$router.push({
                path:'/home'
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
            let storage = window.localStorage;
            if (storage.textbook) {
                let textBookList = JSON.parse(storage.textbook);
                let textBookIndex = textBookList.map(item => item.subjectTypeName).indexOf(title)
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
            console.log(title)
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
                    // this.subjectList=[]
                    console.log(JSON.parse(JSON.stringify(this.subjectList)));
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
    },
    watch: {

    },
    // updated() {
    //     //这里就是监听当DOM元素完全加载的时候，获取表格中的数据
    //     this.$nextTick(()=>{
    //         let dataFom =  []
    //         let dataList = ()  =>{
    //             this.unitTestList.forEach((value, index) => {
    //                 value.difficultyList.forEach((ienmt, i)=>{
    //                     dataFom.push(ienmt)
    //                 }) 
    //             });
    //             return dataFom
    //         }
    //         let arr = dataList()
    //         this.$nextTick(()=>{
    //             let ClassName = document.getElementsByClassName("unitTest_span")
    //             console.log(arr)
    //         })

    //     })
    // },

}
</script>

<style lang="less" scoped>
/deep/.van-tab--active {
    font-weight: 700;
}

/deep/.van-tabs__line {
    background: #fff;
}

.tou {
    /deep/.van-icon {
        font-size: 16px;
    }

    .tou-return {
        position: fixed;
        top: 0;
        z-index: 200;
        width: 40px;
        padding-left: 14.5px;
        background: #fff;
        height: 44px;
        border: none;
        // line-height: 45.5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }

    .tabs {
        border: none;
        box-sizing: border-box;
        margin: 0 auto;

        /deep/.van-tabs__wrap {
            padding-left: 28px;
            box-sizing: border-box;
        }

        .secretary {
            width: 345px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 8px 0 rgba(220, 220, 220, 0.5);
            height: 155px;
            margin: 0 auto;
            margin-top: 20px;
            display: flex;
            align-items: center;

            .secretary-left {
                height: 80%;
                font-size: 15px;
                font-weight: 700;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                color: #333333;

                div:nth-child(1) {
                    margin-left: 25px;
                }

                div:nth-child(2) {
                    font-size: 12px;
                    color: #5981F9;
                    width: 90px;
                    height: 30px;
                    border: 1px solid #5981F9;
                    text-align: center;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 20px;
                }
            }
        }

        .image {
            position: relative;
            height: 105px;
            width: 85px;
            margin-left: 34px;

            img {
                height: 105px;
                width: 85px;
            }

            .subjectClss {
                position: absolute;
                font-size: 13px;
                font-weight: 700;
                right: 10.5px;
                top: 20.5px;
            }

            .ageversion {
                position: absolute;
                transform: scale(0.8);
                font-size: 11px;
                font-weight: 500;
                color: #FFFFFF;
                left: 15px;
                top: 38px;
            }

            // span:nth-child(1) {
            //     position: absolute;
            //     font-size: 13px;
            //     font-weight: 700;
            //     right: 10.5px;
            //     top: 20.5px;
            // }

            // span:nth-child(2) {
            //     width: 42.5px;
            //     position: absolute;
            //     transform: scale(0.8);
            //     font-size: 10px;
            //     left: 6px;
            //     top: 38px;
            //     color: #fff;
            //     text-align: center;
            // }
        }
    }

    
}
</style>

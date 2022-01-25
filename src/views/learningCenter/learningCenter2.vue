<template>
<div style="background: #f8f8f8;min-height: 100vh; ">
    <div class="tou">
        <div style="position: relative;">
            <div class="tou-return" :style="subjectList.length == 0 ? 'background: #f8f8f8' : 'background: #fff'" @click="onClickLeft">
                <van-icon name="arrow-left" slot="left" />
            </div>
            <div class="tabs" v-show="subjectList.length > 0">
                <van-tabs v-model="active" @click="onClick" sticky>
                    <van-tab v-for="(value,index) in subjectList" :key="index" :title="value.subjectTypeName" >
                        <div class="secretary">
                            <div class="image" style="">
                                <img :src="url" alt="">
                                <span class="subjectClss">{{ subject }}</span>
                                <div class="ageversion">
                                    <div>{{age}}</div>
                                    <div>{{version}}</div>
                                </div>
                            </div>
                            <div class="secretary-left">
                                <div style="font-weight: 500;">{{ textbookVersion }}</div>
                                <div @click="switchVersion">切换版本</div>
                            </div>
                        </div>
                        <div class="unit" v-if="List && List.length > 0">
                            <div v-for="(value,index) in List" :key="index">
                                <div class="unit-text" style="color: #333333;font-weight: 500;">{{ value.nodeName }}</div>
                                <ul>
                                    <li style="font-weight: 400;" v-for="(ietm,index) in value.children" :key="index">
                                        <span class="videoPractice" @click="videoPracticeClick(ietm)">{{ ietm.nodeName }}</span>
                                        <span class="lianxi" @click="exercise(ietm,value)">
                                            <img :src="ietm.url" alt="">
                                            <span :style="ietm.onlineCourseLearningDetail === null ? 'color: #CDCDCD' : 'color: #5981F9'">练习</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <NoResult :class="subjectList.length == 0 ? 'all-center' : 'mgt30'"  v-if="List.length == 0 || subjectList.length == 0"></NoResult>
    </div>
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
    learningCenterDirectory,
    createLearnCentreCourse
} from '../../api/learningCenter'
import {
    arrToTree
} from '@/utils/arrToTree.js'
import {
    createHuiXueTask
} from "@/api/teach"
import NoResult from '../../components/NoResult/index'
export default {
    data() {
        return {
            active: 0,
            subjectList: [],
            subject: '',
            grade: '',
            List: [],
            subjectType: '',
            textbookVersion: '',
            age: '',
            version: '',
            url: '',
        }
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        // 更改教学图片
        changeTheTeachingPicture(value) {
            switch (value) {
                case '语文':
                    this.url = require('../../../src/assets/img/learningCenter/shuben2.png');
                    break;
                case '数学':
                    this.url = require('../../../src/assets/img/learningCenter/shuben1.png');
                    break;
                case '英语':
                    this.url = require('../../../src/assets/img/learningCenter/shuben3.png');
                    break;
                case '物理':
                    this.url = require('../../../src/assets/img/learningCenter/shuben1.png');
                    break;
                case '化学':
                    this.url = require('../../../src/assets/img/learningCenter/shuben2.png');
                    break;
                case '政治':
                    this.url = require('../../../src/assets/img/learningCenter/shuben.png');
                    break;
                case '历史':
                    this.url = require('../../../src/assets/img/learningCenter/shuben.png');
                    break;
                case '生物':
                    this.url = require('../../../src/assets/img/learningCenter/shuben3.png');
                    break;
                case '地理':
                    this.url = require('../../../src/assets/img/learningCenter/shuben3.png');
                    break;
            }
        },
        // 获取教材信息的接口请求数据
        gettingInformation(type = '', subjectType) {
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            let params = {}
            if (this.$route.query.subjectType) {
                textBook.forEach((a, i) => {
                    if (a.subjectType == subjectType) {
                        params = {
                            "interUser": "runLfb",
                            "interPwd": "25d55ad283aa400af464c76d713c07ad",
                            "operateAccountNo": this.getUserInfo.accountNo,
                            "accountNo": this.getUserInfo.accountNo,
                            "classGrade": this.grade,
                            "textBookId": type == '' ? textBook[i].textBookId : a.textBookId,
                            "termType": type == '' ? textBook[i].termType : a.termType,
                            "subjectType": type == '' ? textBook[i].subjectType : a.subjectType
                        }
                    }
                })
            } else {
                params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "accountNo": this.getUserInfo.accountNo,
                    "classGrade": this.grade,
                    "textBookId": type == '' ? textBook[0].textBookId : type.textBookId,
                    "termType": type == '' ? textBook[0].termType : type.termType,
                    "subjectType": type == '' ? textBook[0].subjectType : type.subjectType
                }
            }
            return params
        },
        // 教材版本信息展示
        headTextbookInformation(i, type = '', subjectType) {
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            if (this.$route.query.subjectType) {
                let arr = this.subjectList.find(a => (a.subjectType == subjectType))
                if (arr) {
                    this.subjectList.forEach((a, i) => {
                        if (a.subjectType == this.$route.query.subjectType) {
                            let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                            this.textbookVersion = `${a.textBookName}${jianji}${a.subjectTypeName}${a.termTypeName}`
                            this.subject = a.subjectTypeName
                            this.age = jianji
                            this.version = a.termTypeName
                            this.changeTheTeachingPicture(this.subject)
                        }
                    })
                }
            } else {
                if (type == '') {
                    let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                    this.textbookVersion = `${textBook[i].textBookName}${jianji}${textBook[i].subjectTypeName}${textBook[i].termTypeName}`
                    this.subject = textBook[i].subjectTypeName
                    this.age = jianji
                    this.version = textBook[i].termTypeName
                    this.changeTheTeachingPicture(this.subject)
                } else {
                    let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                    this.textbookVersion = `${type.textBookName}${jianji}${type.subjectTypeName}${type.termTypeName}`
                    this.subject = type.subjectTypeName
                    this.age = jianji
                    this.version = type.termTypeName
                    this.changeTheTeachingPicture(this.subject)
                }
            }
        },

        // 获取教材信息
        async learningCenterDirectory(type = '', subjectType) {
            let params = this.gettingInformation(type, subjectType)
            learningCenterDirectory(params).then((res) => {
                if (res.flag) {
                    let list = res.data
                    let bookCourseListTermT01 = null
                    bookCourseListTermT01 = arrToTree(list, 'nodeId', 'parentId');
                    bookCourseListTermT01 = JSON.parse(JSON.stringify(bookCourseListTermT01))
                    if(bookCourseListTermT01.length == 0){
                        this.List = []
                        let storage = window.localStorage;
                        let textBook = JSON.parse(storage.textbook)
                        this.subject = this.subject == '' ? this.subject = textBook[0].subjectTypeName : this.subject
                        let arrt = textBook.find(v => (v.subjectTypeName == this.subject))
                        let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                        this.textbookVersion = `${arrt.textBookName}${jianji}${arrt.subjectTypeName}${arrt.termTypeName}`
                        this.subject = arrt.subjectTypeName
                        this.age = jianji
                        this.version = arrt.termTypeName
                        this.changeTheTeachingPicture(this.subject)
                        return false
                    } 
                    this.List = bookCourseListTermT01[0].children
                    if (type == '') {
                        if (this.$route.query.subjectType) {
                            let arr = this.subjectList.find(a => (a.subjectType == this.subjectType))
                            if (arr) {
                                this.subjectList.forEach((a, i) => {
                                    if (a.subjectType == this.$route.query.subjectType) {
                                        this.headTextbookInformation(i, '', a.subjectType)
                                    }
                                })
                            } else {
                                this.headTextbookInformation(0)
                            }
                        } else {
                            this.headTextbookInformation(0)
                        }
                    } else {
                        this.headTextbookInformation('', type)
                    }
                    this.List.forEach(value => {
                        if (value.children) {
                            value.children.sort(function (a, b) {
                                return a.indexNo - b.indexNo;
                            })
                            value.children.forEach(ietm => {
                                if (ietm.onlineCourseLearningDetail) {
                                    ietm.url = require('../../assets/img/learningCenter/1.png')
                                } else {
                                    ietm.url = require('../../assets/img/learningCenter/2.png')
                                }
                            })
                        }
                    })
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        //年级学科信息以及配置信息
        getGradeSubjectTypeRelationList() {
            return new Promise((resolve, reject) => {
                let params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,
                    "classGrade": this.grade
                }
                getGradeSubjectTypeRelationList(params).then(res => {
                    if (res.flag) {
                        this.subjectList = res.data || [];
                        let storage = window.localStorage;
                        if (storage.textbook == undefined) {
                            this.refreshTextBook()
                        } else {
                            this.learningCenterDirectory('', this.$route.query.subjectType)
                            if (this.$route.query.subjectType) {
                                this.subjectList.forEach((a, i) => {
                                    if (a.subjectType == this.$route.query.subjectType) {
                                        this.active = i
                                        this.subjectType = this.subjectList[i].subjectType
                                    }
                                })
                            } else {
                                let textbook = JSON.parse(storage.textbook)
                                this.subjectList.forEach((a, i) => {
                                    if (a.subjectType == textbook[0].subjectType) {
                                        this.active = i
                                        this.subjectType = this.subjectList[i].subjectType
                                    }
                                })
                            }
                        }
                        resolve(this.subjectList)
                    } else {
                        this.$toast(res.msg)
                        resolve(this.subjectList)
                    }
                })
            })
        },
        refreshTextBook() {
            try {
                let storage = window.localStorage;
                this.textBookObj = JSON.parse(storage.getItem("textbook")).filter((item) => item.subjectType == this.subjectList[this.active].subjectType)[0]
            } catch (e) {
                this.textBookObj = {}
                this.$router.push({
                    path: '/switchVersion',
                    query: {
                        subjectType: this.subjectList[this.active].subjectType
                    }
                })
            }
        },
        // 导航栏切换
        onClick(name, title) {
            this.subject = title
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            let add = textBook.find(v => (v.subjectTypeName == title))//判断缓存中是否有当前点击的学科如果没有就去选择学科页
            this.subjectType = this.subjectList[name].subjectType
            if (!add) {
                this.subjectType = this.subjectList[name].subjectType
                this.$router.push({
                    name: 'switchVersion',
                    query: {
                        subjectType: this.subjectList[name].subjectType
                    }
                })
            } else {
                this.learningCenterDirectory(add, this.subjectList[name].subjectType)
                    // 重缓存中拿到当前点击的学科放到第一位
                for (var i = 0; i < textBook.length; i++) {
                    if (textBook[i].subjectType === this.subjectList[name].subjectType) {
                        textBook.splice(i, 1);
                        break;
                    }
                }
                textBook.unshift(add);
                storage.setItem("textbook", JSON.stringify(textBook));
            }
        },
        // 切换版本
        switchVersion() {
            this.$router.push({
                name: 'switchVersion',
                query: {
                    subjectType: this.subjectType == '' ? this.subjectList[0].subjectType : this.subjectType
                }
            })
        },
        judgmentMaterials() {
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            this.subjectType = this.subjectType == '' ? this.subjectType = this.subjectList[0].subjectType : this.subjectType = this.subjectType
            let arr = textBook.find(v => (v.subjectType == this.subjectType))
            return arr
        },
        // 返回所有课程
        allChapters() {
            let data = []
            this.List.forEach(v => {
                v.children.forEach(iemt => {
                    if (iemt.nodeType == "N00") {
                        data.push(iemt)
                    }
                })
            })
            return data
        },
        // 获取导航栏状态信息
        getCurrent() {
            this.subjectType = this.subjectType == '' ? this.subjectType = this.subjectList[0].subjectType : this.subjectType = this.subjectType
            this.subjectList.forEach((v, i) => {
                if (v.subjectType == this.subjectType) {
                    this.active = i
                }
            })
        },
        // 选择课程
        videoPracticeClick(item) {
            console.log(item,"item")
            let arr = this.judgmentMaterials()
            if (!item.onlineCourseLearningDetail) {
                let data = this.allChapters()
                let params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "accountNo": this.getUserInfo.accountNo,
                    "classGrade": this.grade,
                    "textBookId": arr.textBookId,
                    "termType": arr.termType,
                    "subjectType": arr.subjectType,
                    "sysCourseId": item.courseId,
                    "totalChapterNum": data.length,
                    "parentId": item.parentId
                }
                console.log(params,"params")
                createLearnCentreCourse(params).then(res => {
                    if (res.flag) {
                        this.learningCenterDirectory(arr, arr.subjectType)
                        this.getCurrent()
                        setTimeout(() => {
                            data.forEach(value =>{
                                if(value.courseId == item.courseId){
                                    if (!value.resHuiXueResourceRelationVoList) {
                                        this.$toast('该课程没有学习课件')
                                        return false
                                    }
                                    let id = value.resHuiXueResourceRelationVoList[0].objectId
                                    let userInfo = this.$store.getters.getUserInfo;
                                    let classGrade = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                                    let titleName = `${arr.textBookName}${classGrade}${arr.subjectTypeName}${arr.termTypeName}`
                                    userInfo.titleName = titleName;
                                    this.$store.commit('setUserInfo', userInfo)
                                    this.$router.push({
                                        name: 'videoPractice',
                                        query: {
                                            subjectType: this.subjectType == '' ? this.subjectType = this.subjectList[0].subjectType : this.subjectType = this.subjectType,
                                            id: id
                                        }
                                    })
                                }
                            })
                        },1000)
                    } else {
                        this.$toast(res.msg)
                    }
                })
                return false
            }
            if (!item.resHuiXueResourceRelationVoList) {
                this.$toast('该课程没有学习课件')
                return false
            }
            let userInfo = this.$store.getters.getUserInfo;
            let classGrade = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
            let titleName = `${arr.textBookName}${classGrade}${arr.subjectTypeName}${arr.termTypeName}`
            userInfo.titleName = titleName;
            this.$store.commit('setUserInfo', userInfo)
            let id = item.resHuiXueResourceRelationVoList[0].objectId
            this.$router.push({
                name: 'videoPractice',
                query: {
                    subjectType: this.subjectType == '' ? this.subjectType = this.subjectList[0].subjectType : this.subjectType = this.subjectType,
                    id: id
                }
            })
        },

        exercise(item, values) {
            if (!item.onlineCourseLearningDetail) {
                this.$toast('请先学习微课再进行练习')
            }
            if (item.onlineCourseLearningDetail.learningStatus == 'S03') {
                let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                let add = this.judgmentMaterials()
                //命名规则：年级学科+练习+年月日时分
                const taskName = jianji + add.subjectTypeName + '练习' + this.$moment().format('YYYYMMDDHHmm')
                const params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,

                    "subjectType": add.subjectType,
                    "classGrade": add.classGrade,
                    "termType": add.termType,
                    "sysCourseIdList": [item.courseId],
                    "examRuleList": [{
                        "type": "T01", //选择题
                        "cnt": 20, //20道
                        "score": 5 //每道5分
                    }],
                    "shareType": 'S03',
                    "diffLevel": null,
                    "degree": "D02",
                    "duration": 0, //写死
                    "taskName": taskName,
                    "taskType": 'T23', //练习
                    "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: values.nodeId
                    }, ]
                }
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
            } else {
                this.$toast('请先学习微课再进行练习')
            }
        },
    },
    async mounted() {
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
            await this.getGradeSubjectTypeRelationList()
        }
        
    },
    beforeDestroy() {},
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    components: {
        NoResult
    }
}
</script>

<style lang="less" scoped>
/deep/.van-tab--active {
    font-weight: 700;

}

/deep/.van-tabs__line {
    background: #fff;
}

/deep/.van-icon {
    font-size: 16px;
}

.tou {
    .tou-return {
        position: fixed;
        top: 0;
        z-index: 200;
        width: 40px;
        padding-left: 14.5px;
        background: #fff;
        height: 44px;
        border: none;
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
            box-shadow: 0 0.533vw 2.133vw 0 rgb(220 220 220 / 50%);
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
                    line-height: 35px;
                    margin-left: 20px;
                }
            }
        }
        .unit {
            width: 345px;
            background: #fff;
            height: 100%;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 10px;
            box-shadow: 0 0.533vw 2.133vw 0 rgb(220 220 220 / 50%);
            padding: 20px;
            box-sizing: border-box;
            .unit-text {
                font-weight: 700;
                font-size: 17px;
                padding-top: 20px;
                box-sizing: border-box;
                padding-bottom: 10px;
            }

            ul li {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 15px;
                color: #333333;
                border-bottom: 1px solid #DDDDDD;
                padding: 5px 0;

                .videoPractice {
                    width: 200px;
                    text-overflow: ellipsis;
                }

                .lianxi {
                    display: flex;
                    align-items: center;
                    color: #CDCDCD;

                    img {
                        width: 15px;
                        height: 15px;
                        object-fit:contain;
                    }
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
                object-fit: contain;
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
        }

    }
}
</style>

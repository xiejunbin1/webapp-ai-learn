<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar title="学习记录" :fixed="true" :placeholder="true" :z-index="99" left-text="" left-arrow @click-left="onClickLeft" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="diagnosticList" v-for="(value, index) in diagnosticList" :key="index" @click="jumpPage(value)" v-show="diagnosticList.length > 0">
                <div class="diagnosticList-left">
                    <div class="diagnosticList_img"><img  v-lazy="value.imageUrl" :key="value.imageUrl" alt=""></div>
                    <div>
                        <ul>
                            <li>{{ value.sysCourseName }}</li>
                            <li>{{ value.diagnoseVolumeAttributes }}</li>
                            <li>{{ value.dateOfDiagnosis }}</li>
                        </ul>
                    </div>
                </div>
                <div class="diagnosticList-right">
                    <div class="van-icons">
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>
    <NoResult class="all-center"  v-if="diagnosticList.length == 0"></NoResult>
</div>
</template>

<script>
import {
    getLearningRecordList
} from '../../api/teach'
import {
    getGradeSubjectTypeRelationList
} from "@/api/resource"
import {
    getTextBookVersionByGradeTerm
} from "@/api/resource"
import {
    mapGetters
} from 'vuex'
import NoResult from '../../components/NoResult/index'
export default {
    data() {
        return {
            isLoading: false,
            loading: false,
            finished: false,
            diagnosticList: [],
            index: 1,
        }
    },
    methods: {
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
        onRefresh() {
            this.index = 1
            this.finished = false
            this.isLoading = false,
            this.loading = false,
            
            this.getLearningRecordList(1).then(res => {
                if (res == '失败') {
                    this.$toast('加载失败');
                    this.isLoading = false;
                } else {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                }
            })
        },

        onLoad() {
            let i = this.index++
            let fonmData = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "taskType": "",
                "subjectType": "",
                "classGrade": this.getUserProfileInfo.grade,
                "termType": "",
                "pageSize": 10,
                "currentPage": i
            }
            getLearningRecordList(fonmData).then(res => {
                if (res.flag) {
                    if (!res.data) {
                        this.finished = true;
                        this.$toast('没有更多了');
                        return
                    }
                    this.diagnosticList = [...this.diagnosticList, ...res.data]
                    this.diagnosticList.forEach((v, i) => {
                        let daDe = new Date(v.learningBeginDate)
                        v.dateOfDiagnosis = `${daDe.getFullYear()}-${(daDe.getMonth()+1)}-${daDe.getDate()} ${daDe.getHours()} : ${daDe.getMinutes()}`
                        v.diagnoseVolumeAttributes = `已完成 ${v.learningRate} %`
                        if (!v.coursewareInfo) {
                            v.imageUrl = require('../../assets/img/learningCenter/defaultVideo.png')
                        } else {
                           v.imageUrl = v.coursewareInfo.imageUrl || require('../../assets/img/learningCenter/defaultVideo.png')
                        }
                    })
                    if (res.data.length < 10) {
                        this.finished = true;
                        this.$toast('没有更多了');
                        return
                    }
                    this.loading = false;
                    console.log(res)
                } else {
                    this.$toast(res.msg);

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
                    "classGrade": this.getUserProfileInfo.grade,
                }
                getGradeSubjectTypeRelationList(params).then(res => {
                    if (res.flag) {
                        resolve(res.data)
                    }
                })
            })
        },
        // 获取教材版本
        getTextBookVersionByGradeTerm(value) {
            return new Promise((resolve, reject) => {
                this.getGradeSubjectTypeRelationList().then((data) => {
                    let params = {
                        "interUser": "runLfb",
                        "interPwd": "25d55ad283aa400af464c76d713c07ad",
                        "operateAccountNo": this.getUserInfo.accountNo,
                        "gradeTermId": '',
                        "subjectType": value,
                        "bookTypeIn": "",
                        "classGrade": this.getUserProfileInfo.grade
                    }
                    getTextBookVersionByGradeTerm(params).then(res => {
                        if (res.flag) {
                            resolve(res.data)
                        }
                    })
                })
            })
        },
        // 获取数据
        getLearningRecordList(index) {
            return new Promise((resolve, reject) => {
                let pomsen = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,
                    "taskType": "",
                    "subjectType": "",
                    "classGrade": this.getUserProfileInfo.grade,
                    "termType": "",
                    "pageSize": 10,
                    "currentPage": index
                }
                getLearningRecordList(pomsen).then(res => {
                    if (res.flag) {
                        if (!res.data) {
                            this.finished = true;
                            this.$toast('没有更多了');
                            return
                        }
                        this.diagnosticList = []
                        this.diagnosticList = res.data
                        this.diagnosticList.forEach((v, i) => {
                            let daDe = new Date(v.learningBeginDate)
                            v.dateOfDiagnosis = `${daDe.getFullYear()}-${(daDe.getMonth()+1)}-${daDe.getDate()} ${daDe.getHours()} : ${daDe.getMinutes()}`
                            v.diagnoseVolumeAttributes = `已完成 ${v.learningRate} %`
                            if (!v.coursewareInfo) {
                                v.imageUrl = require('../../assets/img/learningCenter/defaultVideo.png')
                            } else {
                                v.imageUrl = v.coursewareInfo.imageUrl || require('../../assets/img/learningCenter/defaultVideo.png')
                            }
                        })
                        resolve(this.diagnosticList)
                        this.loading = false;
                    } else {
                        this.$toast(res.msg);
                        resolve('失败')
                    }
                })
            })
        },

        // 跳转视频页
        async jumpPage(values) {
            let arr = await this.getGradeSubjectTypeRelationList()
            let add = await this.getTextBookVersionByGradeTerm(values.record.subjectType) 
            let subjectTypeName = arr.find(v => (values.record.subjectType === v.subjectType))
            let textBook = add.find(v => (values.record.textBookId === v.textBookId))
            let userInfo = this.$store.getters.getUserInfo;
            let classGrade = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
            let termType = values.record.termType === "T01" ? '上册' : '下册'
            let titleName = `${textBook.textBookName}${classGrade}${subjectTypeName.subjectTypeName}${termType}`
            userInfo.titleName = titleName;
            this.$store.commit('setUserInfo', userInfo)
            this.$router.push({
                path: '/videoPractice',
                query: {
                    subjectType: values.subjectType,
                    id: values.sysCourseId,
                    textBookId: values.record.textBookId,
                    termType: values.record.termType
                }
            })
        }
    },
    mounted() {
        const that = this
        window.onresize = () => {
            return (() => {
                window.fullWidth = document.documentElement.clientWidth
                that.fullWidth = window.fullWidth
            })()
        }
    },
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
/deep/.van-ellipsis {
    font-weight: 500;
    color: #333333;
}

.diagnosticList {
    width: 100%;
    height: 120px;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 6px 10px;
    position: relative;
    border-bottom: 1px solid #DDDDDD;
    justify-content: space-between;

    /deep/.van-icon {
        font-size: 16px;
    }

    .diagnosticList_img {
        position: relative;
        width: 104px;
        height: 75px;

        .Textbook {
            position: absolute;
            z-index: 99;
            font-size: 15px;
            font-weight: 500;
            color: #FFFFFF;
            top: 11px;
            left: 26px;
        }
        img {
            width: 104px;
            height: 75px;
        }
    }
    ul {
        height: 75px;
        width: 190px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 5px;

        li {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        li:nth-child(1) {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
        }

        li:nth-child(2) {
            font-size: 13px;
            font-weight: 500;
            width: 170px;
            color: #666666;
        }

        li:nth-child(3) {
            font-size: 11px;
            font-weight: 400;
            color: #999999;
        }

    }

    .carryOn {
        font-size: 13px;
        font-weight: 400;
        color: #5981F9;
    }

    .van-icons {
        display: flex;
        align-items: center;
    }

    // 修改右侧样式new----
    .diagnosticList-left,
    .diagnosticList-right {
        display: flex;
    }

    .diagnosticList-left {
        width: 70%;
    }

    .diagnosticList-right {
        width: 30%;
        box-sizing: border-box;

        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: 100px;
    }
}
</style>

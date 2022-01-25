<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar title="练习记录" :fixed="true" :placeholder="true" :z-index="99" left-text="" left-arrow @click-left="onClickLeft" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="diagnosticList" v-for="(value, index) in diagnosticList" :key="index" @click="jumpPage(value)" v-show="diagnosticList.length > 0">
                <div class="diagnosticList-left">
                    <div class="diagnosticList_img"><img v-lazy="value.url" :key="value.url" alt="">
                        <div class="Textbook">{{ value.Textbook }}</div>
                    </div>
                    <div>
                        <ul>
                            <li>{{ value.taskName }}</li>
                            <li>{{ value.diagnoseVolumeAttributes }}</li>
                            <li>{{ value.dateOfDiagnosis }}</li>
                        </ul>
                    </div>
                </div>
                <div class="diagnosticList-right">
                    <div class="carryOn" v-if="value.isFinish != 'S03'">继续练习</div>
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
    getHuiXueTaskList
} from '../../api/teach'
import {
    mapGetters
} from 'vuex'
import NoResult from '../../components/NoResult/index'
import { datrasx } from '../../utils/filter'
export default {
    data() {
        return {
            isLoading: false,
            loading: false,
            finished: false,
            diagnosticList: [],
            index: 1,
            subject: [{
                subjectType: "S01",
                subjectTypeName: "语文",
            }, {
                subjectType: "S02",
                subjectTypeName: "数学",

            }, {
                subjectType: "S03",
                subjectTypeName: "英语"
            }, {
                subjectType: "S04",
                subjectTypeName: "物理"
            }, {
                subjectType: "S05",
                subjectTypeName: "化学"
            }, {
                subjectType: "S06",
                subjectTypeName: "政治"
            }, {
                subjectType: "S07",
                subjectTypeName: "历史",
            }, {
                subjectType: "S08",
                subjectTypeName: "生物",
            }]
        }
    },
    methods: {
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
        // 下拉刷新
        onRefresh() {
            this.index = 1
            this.finished = false
            this.isLoading = false,
            this.loading = false,
            this.getHuiXueTaskList(1).then(res => {
                if (res == '失败') {
                    this.$toast('加载失败');
                    this.isLoading = false;
                } else {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                }
            })
        },
        // 获取数据
        getHuiXueTaskList(index) {
            return new Promise((resolve, reject) => {
                let fonmData = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,
                    "taskType": "T23",
                    "subjectType": "",
                    "classGrade": this.getUserProfileInfo.grade,
                    "termType": "",
                    "pageSize": 10,
                    "currentPage": index
                }
                getHuiXueTaskList(fonmData).then(res => {
                    if (res.flag) {
                        this.diagnosticList = []
                        this.diagnosticList = res.data
                        this.diagnosticList.forEach((v, i) => {
                            let daDe = new Date(v.lastUpdateDate)
                            v.dateOfDiagnosis = `${daDe.getFullYear()}-${(daDe.getMonth()+1)}-${daDe.getDate()} ${daDe.getHours()} : ${daDe.getMinutes()}`
                            this.diagnosticList[i].diagnoseVolumeAttributes = this.$options.filters.getGradeName(v.classGrade)
                            this.subject.forEach(value => {
                                if (value.subjectType == v.subjectType) {
                                    this.diagnosticList[i].diagnoseVolumeAttributes += value.subjectTypeName
                                }
                            })
                            if (!v.usedList) {

                            } else {
                                v.usedList.forEach(a => {
                                    this.diagnosticList[i].diagnoseVolumeAttributes += a.resourceName
                                })
                            }
                        })
                        this.diagnosticList = datrasx(this.diagnosticList)
                        resolve(this.diagnosticList)
                    } else {
                        this.$toast(res.msg);
                        resolve('失败')
                    }
                })
            })
        },
        // 上拉加载
        onLoad() {
            let i = this.index++
            return new Promise((resolve, reject) => {
                let fonmData = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,
                    "taskType": "T23",
                    "subjectType": "",
                    "classGrade": this.getUserProfileInfo.grade,
                    "termType": "",
                    "pageSize": 10,
                    "currentPage": i
                }
                getHuiXueTaskList(fonmData).then(res => {
                    if (res.flag) {
                        if (!res.data) {
                            this.finished = true;
                            this.$toast('没有更多了');
                            return
                        }
                        this.diagnosticList = [...this.diagnosticList, ...res.data]
                        this.diagnosticList.forEach((v, i) => {
                            let daDe = new Date(v.lastUpdateDate)
                            v.dateOfDiagnosis = `${daDe.getFullYear()}-${(daDe.getMonth()+1)}-${daDe.getDate()} ${daDe.getHours()} : ${daDe.getMinutes()}`
                            this.diagnosticList[i].diagnoseVolumeAttributes = this.$options.filters.getGradeName(v.classGrade)
                            this.subject.forEach(value => {
                                if (value.subjectType == v.subjectType) {
                                    this.diagnosticList[i].diagnoseVolumeAttributes += value.subjectTypeName
                                }
                            })
                            if (!v.usedList) {

                            } else {
                                v.usedList.forEach(a => {
                                    this.diagnosticList[i].diagnoseVolumeAttributes += a.resourceName
                                })
                            }

                        })
                        this.diagnosticList = datrasx(this.diagnosticList)
                        if (res.data.length < 10) {
                            this.finished = true;
                            this.$toast('没有更多了');
                            return
                        }
                        this.loading = false;
                        resolve(res.data)
                    } else {
                        this.$toast(res.msg);
                        resolve('失败')
                    }
                })
            })
        },

        jumpPage(values) {
            console.log(values)
            if (values.isFinish == 'S03') {
                this.$router.push({
                    path: '/practiceResult',
                    query: {
                        taskId: values.taskId,
                        tchCourseId: values.tchCourseId,
                        recordingId: 1
                    }
                })
            } else {
                //命名规则：年级学科+练习+年月日时分
                let query = {
                    taskId: values.taskId,
                    tchCourseId: values.tchCourseId,
                    recordingId: 1
                }
                this.$router.push({
                    path: '/togetherPractice',
                    query: query
                })
            }
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
    padding: 6px;
    position: relative;
    border-bottom: 1px solid #DDDDDD;
    justify-content: space-between;

    /deep/.van-icon {
        font-size: 16px;
    }

    .diagnosticList_img {
        position: relative;
        width: 82px;
        height: 81px;

        .Textbook {
            position: absolute;
            z-index: 99;
            font-size: 15px;
            font-weight: 500;
            color: #FFFFFF;
            top: 11px;
            left: 26px;
        }
    }

    img {
        width: 82px;
        height: 81px;
    }

    ul {
        height: 81px;
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
        padding-right: 20px;
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

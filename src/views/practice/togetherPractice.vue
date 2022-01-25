<template>
<div class='judge-learning-title'>
    <van-nav-bar fixed placeholder title="同步练习" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='onClickLeft' />
            <svg-icon class="fs17" icon-class="icon-cross" @click="goToHome" />
        </template>
    </van-nav-bar>
    <div class='title-content'  v-if="examList && examList.length>0">
        <div>
            <div>
                <span class='exam-index'>{{examIndex+1}}</span>
                <span class='mgr10 exam-gary'>/{{examList.length}}</span>
                <span class="exam-gary">（综合难度：{{examList[examIndex].examQuestion.titleDegree | getTitleDegree}}）</span>
                <!-- {{totalDuration}} {{examDuration}} -->
            </div>
            <div class="lh30" v-html="examList[examIndex].examQuestion.title">

            </div>
            <div v-show="examList[examIndex].isShowDetail" class='analysis-box'>
                <div class='answer-analysis'>答案解析</div>
                <div class="student-answer">你的答案</div>
                <div class='mgb15 lh30' v-html="examList[examIndex].examQuestion.userAnswer"></div>
                <div class='right-answer'>正确答案</div>
                <div class='mgb15 lh30' v-html="examList[examIndex].examQuestion.answer"></div>
                <div class='analysis'>解析</div>
                <div class="lh30" v-html="examList[examIndex].examQuestion.examExplain"></div>
            </div>
        </div>

    </div>
    <div class='answer-box' v-if="examList && examList.length>0">
        <van-button v-show="!examList[examIndex].isShowDetail" class='answer-box-button' plain :type="examList[examIndex].examQuestion.userAnswer == oItem.value?'info':'default'" @click="toAnswer(oItem)" v-for="(oItem,oIndex) in optionList.slice(0,examList[examIndex].examQuestion.optionCount)" :key="oIndex">{{oItem.code}}</van-button>
        <van-button v-show="examList[examIndex].isShowDetail&&examIndex!=examList.length-1" round block plain type="info" @click="nextExam">下一题</van-button>
        <van-button v-show="examList[examIndex].isShowDetail&&examIndex==examList.length-1" round block plain type="info" @click="goToReport">查看结果</van-button>
    </div>
    <NoResult class='all-center' v-else></NoResult>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getCourseTaskDetail,
    saveExamAnswer,
    commitExamResultV3
} from '@/api/teach'
import {
    setTimeout,
    clearTimeout
} from 'timers';
import NoResult from "@/components/NoResult"
export default {
    name: 'togetherPractice',
    components: {
        NoResult
    },
    data() {
        return {
            query: {},
            examList: [{
                examQuestion: {

                },
                isShowDetail: false
            }],
            examIndex: 0,
            optionList: [{
                    code: 'A',
                    value: '<p>A</p>'
                },
                {
                    code: 'B',
                    value: '<p>B</p>'
                },
                {
                    code: 'C',
                    value: '<p>C</p>'
                },
                {
                    code: 'D',
                    value: '<p>D</p>'
                },
                {
                    code: 'E',
                    value: '<p>E</p>'
                },
                {
                    code: 'F',
                    value: '<p>F</p>'
                },
                {
                    code: 'G',
                    value: '<p>G</p>'
                },
                {
                    code: 'H',
                    value: '<p>H</p>'
                },
                {
                    code: 'I',
                    value: '<p>I</p>'
                },
            ],
            taskType: '', //任务类型
            userAnswerMap: {},
            submitBtnLoading: false,
            totalTimer: null, //总的计时器
            examTimer: null, //单道题的计时器
            totalDuration: 0, //总的时间
            examDuration: 0, //单道题的时间
        };
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
        }),
        notAnswerCount: function () {
            return this.examList.length - Object.keys(this.userAnswerMap).length
        }
    },
    watch: {
        examIndex() {
            if (this.examTimer) {
                clearTimeout(this.examTimer)
            }
            this.examDuration = 0;
            setTimeout(this.setExamTimer, 1000)
        }
    },
    created() {

    },
    mounted() {
        this.examList = [];
        this.query = this.$route.query;
        this.getCourseTaskDetail();
        setTimeout(this.setTotalTimer, 1000)
        setTimeout(this.setExamTimer, 1000)
    },
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeDestroy() {},
    destroyed() {
        clearTimeout(this.totalTimer)
        clearTimeout(this.examTimer)
    },
    methods: {
        //下一题
        nextExam() {
            if (this.examIndex != this.examList.length - 1) {
                this.examIndex += 1;
            }
        },
        //查看结果
        goToReport() {
            // this.getCourseTaskDetail()
            this.submitPaper()
        },

        setTotalTimer() {
            this.totalDuration += 1;
            // console.log(this.totalDuration)
            this.totalTimer = setTimeout(this.setTotalTimer, 1000)
        },
        setExamTimer() {
            this.examDuration += 1;
            // console.log(this.examDuration)
            this.examTimer = setTimeout(this.setExamTimer, 1000)
        },
        selectCity(index) {
            console.log(index)
            // this.$refs.indexBar.scrollTo(index)
            console.log(this.$refs.indexBar)
        },
        changeCity(index) {
            console.log(index)
            // this.$refs.indexBar.scrollTo(index)
            // console.log(this.$refs.indexBar)
        },
        getCourseTaskDetail() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "operateRoleType": 'A03',
                "tchCourseId": this.query.tchCourseId,
                "accountNo": this.getUserInfo.accountNo,
                "taskId": this.query.taskId
            }
            getCourseTaskDetail(params).then(res => {
                if (res.flag) {
                    let list = res.data[0].testPaperInfo[0].sectionExam || [];
                    this.examList = list;
                    this.taskType = res.data[0].taskType;
                    console.log('题目列表')
                    console.log(JSON.parse(JSON.stringify(this.examList)));
                    console.log(this.examList.map((item)=>{return item.examQuestion.answer}))
                } else {
                    let msg = res.msg || '获取失败'
                    this.$toast(msg)
                }
            })
        },
        //作答
        toAnswer(item) {
            console.log(item)
            let exam = this.examList[this.examIndex]
            exam.examQuestion.userAnswer = item.value; //学生作答答案
            exam.examQuestion.duration = exam.examQuestion.duration ? Number(exam.examQuestion.duration) + Number(this.examDuration) : Number(this.examDuration)
            this.$forceUpdate();
            this.userAnswerMap[exam.examQuestion.examId] = item.value
            //computed属性监听对象时候，若对象的引导地址未改变，那么computed将不会检测到。
            this.userAnswerMap = JSON.parse(JSON.stringify(this.userAnswerMap))
            console.log(this.userAnswerMap)
            let status = ''
            if (exam.examQuestion.userAnswer == exam.examQuestion.answer) {
                this.$toast({
                    message: '回答正确',
                    className: 'right-toast',
                    icon: require(('@/assets/img/practice/right.png')),
                });
                status = true;
            } else {
                this.$toast({
                    message: '回答错误',
                    className: 'wrong-toast',
                    icon: require(('@/assets/img/practice/wrong.png')),
                });
                exam.isShowDetail = true;
                status = false;
            }

            this.saveExamAnswer({
                params: {
                    examId: exam.examQuestion.examId,
                    autoScoring: exam.examQuestion.autoScoring,
                    titleType: exam.examQuestion.titleType,
                    userAnswer: exam.examQuestion.userAnswer,
                    knowledgePointId: exam.examQuestion.knowledgePointId,
                    duration: exam.examQuestion.duration || 10, //todo
                },
                success: () => {
                    if (this.examIndex != this.examList.length - 1 && !exam.isShowDetail) {
                        setTimeout(() => {
                            this.examIndex += 1;
                        }, 150)

                    } else {
                        clearTimeout(this.examTimer)
                    }
                }
            })
            //如果是最后一道题，并且答对了，直接交卷查看结果
            if (this.examIndex == this.examList.length - 1 && status) {
                setTimeout(() => {
                    this.submitPaper()
                }, 1500)
            }
        },
        //保存每道题的作答记录
        saveExamAnswer(obj) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "belongSchoolId": this.getUserProfileInfo.schoolId || -1,
                "accountNo": this.getUserInfo.accountNo,
                "taskId": this.query.taskId,
                "tchCourseId": this.query.tchCourseId,
                "classId": -1,
                "examId": obj.params.examId,
                "groupId": -1,
                "taskType": this.taskType,
                "autoScoring": obj.params.autoScoring,
                "titleType": obj.params.titleType,
                "answer": obj.params.userAnswer || '',
                "knowledgePointId": obj.params.knowledgePointId,
                "duration": obj.params.duration,
                "recordDuration": "D01"
            }
            saveExamAnswer(params).then(res => {
                if (res.flag) {
                    obj.success && obj.success(res)
                } else {
                    let msg = res.msg || '作答保存失败'
                    console.log(msg)
                    this.$toast(msg)
                }
            })
        },
        //交卷
        submitPaper() {
            this.commitExamResultV3({
                params: {},
                success: () => {
                    this.$router.push({
                        path: '/practiceResult',
                        query: {
                            taskId: this.query.taskId,
                            tchCourseId: this.query.tchCourseId
                        }
                    })

                }
            })
        },
        commitExamResultV3(obj) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "belongSchoolId": this.getUserProfileInfo.schoolId || -1,
                "accountNo": this.getUserInfo.accountNo,
                "isFinish": "S03",
                "answerSaveMode": "M02",
                "taskId": this.query.taskId,
                "taskType": this.taskType,
                "duration": this.totalDuration || 999,
            }
            commitExamResultV3(params).then(res => {
                if (res.flag) {
                    obj.success && obj.success(res)
                } else {
                    let msg = res.msg || '提交失败'
                    console.log(msg)
                }
            })
        },

        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                title: '',
                message: `确定退出同步练习吗？`,
                // width: 300,
                theme: 'round-button',
            })
            .then(async() => {
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
.all-commit {
    padding: 10px 15px;
    background: #EAF0FF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 400;

    .commit-button {
        width: 100px;
    }
}

.title-content {
    padding: 15px;
    margin-bottom: 80px;
    overflow: hidden;
    font-size: 16px;
}

.exam-index {
    font-size: 20px;
    color: #5981F9;
}

.exam-gary {
    color: #999;
    font-size: 13px;
}

.answer-box {
    height: 70px;
    border-top: 1px solid #DDDDDD;
    position: fixed;
    bottom: 0px;
    width: 345px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
    background: #fff;

    // /deep/.van-button::before {
    //     border: 1px solid #DDDDDD;
    //     background-color: #DDDDDD;
    //     }
    .answer-box-button {
        width: 70px;
        height: 40px;
        border-radius: 4px;
    }
}

.mark-box {
    padding: 15px;
    display: flex;

    .mark-item {
        display: flex;
        align-items: center;
        margin-right: 25px;
        font-size: 13px;
    }

    .circle {
        width: 14px;
        height: 14px;
        border-radius: 7px;
        background: #EAF0FF;
        margin-right: 15px;
    }

    .circle-no {
        width: 14px;
        height: 14px;
        border-radius: 7px;
        background: #f8f8f8;
        margin-right: 15px;
    }
}

.sheet-button-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 15px;

    .sheet-button-item {
        position: relative;
        width: 65px;

        .item-button {
            width: 65px;
            border-radius: 4px
        }

        .now {
            position: absolute;
            background: #666;
            border-radius: 0 0 4px 4px;
            color: #fff;
            width: 100%;
            height: 19px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            bottom: 0px;
        }
    }

    .default-box {
        width: 65px;
        height: 0;
    }

    .bottom {
        position: fixed;
        bottom: 20px;
        justify-self: center;
        width: 345px;
        text-align: center;

        .not-answer-count {
            font-size: 13px;
            color: #999;
            margin-bottom: 20px;

            .count {
                font-size: 20px;
                color: #5981F9;
            }
        }
    }
}

.judge-learning-title {

    // background: #F8F8F8;
    /deep/.van-button--plain.van-button--info {
        background: #EAF0FF;
    }

    /deep/.van-button--plain {
        background: #F8F8F8;
    }
}

.answer-sheet {
    height: 500px;
}

.analysis-box {
    background: #f8f8f8;
    border-radius: 5px;
    padding: 15px;

    .answer-analysis {
        font-size: 17px;
        font-weight: 500;
        margin-bottom: 15px;
    }

    .student-answer {
        font-size: 15px;
        font-weight: 400;
        margin-bottom: 15px;
    }

    .right-answer {
        font-size: 15px;
        color: #22AD7E;
        font-weight: 400;
        margin-bottom: 15px;
    }

    .analysis {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 15px;
    }
}
</style><style lang="less">
.right-toast {
    background: rgba(0, 0, 0, 0);
    width: 200px;

    .van-toast__icon {
        font-size: 130px;
    }

    .van-toast__text {
        color: #22AD7E;
        font-size: 25px;
        font-weight: 500;
        margin-top: 15px;
    }
}

.wrong-toast {
    background: rgba(0, 0, 0, 0);
    width: 200px;

    .van-toast__icon {
        font-size: 130px;
    }

    .van-toast__text {
        color: #E55757;
        font-size: 25px;
        font-weight: 500;
        margin-top: 15px;
    }
}
</style>

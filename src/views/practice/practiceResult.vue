<template>
<div  class='practice-result'>
    <van-nav-bar fixed placeholder title="练习结果" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='goToPractice' />
            <svg-icon class='fs17' icon-class="icon-cross" @click="goToHome" />
        </template>
    </van-nav-bar>
    <van-pull-refresh v-if="resultData && Object.keys(resultData).length>0" style="min-height: 100vh;" v-model="isLoading" @refresh="onRefresh">
        <div ref="practiceResult" class='result-content'>
            <img :src="resultBackgroundUrl" alt="">
            <div class='accord-box'>
                <div class='accord' ref="resultContent">
                    <div class="circle-white-box">
                        <!-- {{currentRate}}--{{rate}} -->
                        <van-circle class="circle-color-box" v-model="currentRate" :rate="rate" :speed="100" layer-color="#22AD7E" color="#E55757">
                            <template #default>
                                <div class="circle-data">
                                    <span class='circle-right-num'>{{resultData.rightExam}}</span>
                                    <span class='circle-total-num'>/{{resultData.totalExam}}</span>
                                </div>
                                <div class="circle-explain">
                                    答对数/总题数
                                </div>
                            </template>
                        </van-circle>
                    </div>
                    <div class="course-name">{{resultData.courseInfo.courseName}}</div>
                    <div class="course-info">
                        <div class="degree-box">
                            <span class="course-label mgr15">难度</span>
                            <van-rate color="#FFDD88" v-model="resultData.relation.taskDegree=='D01'?2:resultData.relation.taskDegree=='D02'?3:4" void-icon="star" void-color="#D8D8D8" />
                        </div>
                        <div>
                            <span class="course-label mgr15">用时</span>
                            <span class="course-label">{{Math.floor(resultData.duration_student/60)}}分{{resultData.duration_student%60}}秒</span>
                        </div>
                    </div>
                    <!-- 答题卡 -->
                    <div class='answer-sheet'>
                        <div class='answer-sheet-name'>答题卡</div>
                        <div class="mark-box">
                            <div class='mark-item'>
                                <div class='circle'></div>答对
                            </div>
                            <div class='mark-item'>
                                <div class='circle-no'></div>答错
                            </div>
                        </div>
                        <div class="sheet-button-box">
                            <div class='sheet-button-item' v-for="(item,index) in examList" :key="index">
                                <van-button class='item-button' plain :type="item.examQuestion.isRight == 'I01'?'info':'danger'" @click="chooseExam(index)">{{index+1}}</van-button>
                            </div>
                            <!-- 解决最后一行不满时没有左对齐问题     +'00'，不然key和上边的div冲突了
                    参考：https://blog.csdn.net/Storm_Bluecat/article/details/115251736 -->
                            <div class="default-box" v-for="n in 10" :key="n+'00'"></div>
                        </div>
                        <div  ref="answerSheet" class='pdb30'>
                            <van-button class="w150 mgr15" type="info" plain round @click="practiceAgain">重新练习</van-button>
                            <van-button class="w150" type="info" round @click="goToPractice">返回练习基地</van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </van-pull-refresh>
    <NoResult class='all-center' v-else></NoResult>

</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getCourseTaskDetail,
    createHuiXueTask
} from '@/api/teach'
import {
    getSubjectName,
    getGradeName,
} from "@/utils/filter";
import NoResult from "@/components/NoResult"
export default {
    name: 'practiceResult',
    components: {
        NoResult
    },
    data() {
        return {
            query: {},
            examList: [{
                examQuestion: {

                }
            }],
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
            userAnswerMap: {},
            submitBtnLoading: false,
            resultBackgroundUrl: require('@/assets/img/practice/result-background.png'),
            rate: 0,
            currentRate: 0, //当rate变化时，currentRate会从0升到rate的值
            resultData: {
                courseInfo: {},
                relation: {},
                sysCourseIdList: [],
                totalExam: 0
            },
            isLoading: false
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
    watch: {},
    created() {

    },
    mounted() {
        this.resultData={}
        this.query = this.$route.query;
        this.getCourseTaskDetail();

    },
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeDestroy() {},
    destroyed() {},
    methods: {
        onRefresh() {
            this.getCourseTaskDetail()
        },
        goToPractice() {
            if (this.query.recordingId) { //返回上一页的标志
                this.$router.go(-1)
            } else {
                this.$router.push({
                    path: '/practiceList'
                })
            }
        },
        chooseExam(index) {
            this.$router.push({
                path: '/examAnalysis',
                query: {
                    pageName: '练习结果',
                    taskId: this.query.taskId,
                    tchCourseId: this.query.tchCourseId,
                    examIndex: index
                }
            })
        },
        practiceAgain() {
            this.createHuiXueTask()
        },
        //创建练习任务
        createHuiXueTask() {
            //命名规则：年级学科+练习+年月日时分
            const taskName = getGradeName(this.resultData.relation.classGrade) + getSubjectName(this.resultData.relation.subjectType) + '练习' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": this.resultData.relation.subjectType,
                "classGrade": this.resultData.relation.classGrade,
                "termType": this.resultData.relation.termType,
                "sysCourseIdList": this.resultData.sysCourseIdList,
                "examRuleList": [{
                    "type": "T01", //选择题
                    "cnt": 20, //20道
                    "score": 5 //每道5分
                }],
                "shareType": 'S03',
                "diffLevel": null,
                "degree": this.resultData.relation.taskDegree,
                "duration": 0, //写死
                "taskName": taskName,
                "taskType": 'T23', //练习
                "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: this.resultData.nodeId
                    },
                    // {
                    //     resourceType:'R98',//版本
                    //     resourceId:this.query.textBookId
                    // },
                ]
            }

            console.log('params', params)
            // return
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
                    this.resultData = res.data[0] || {}
                    // this.resultData = {}
                    this.rate = (this.resultData.totalExam - this.resultData.rightExam) / this.resultData.totalExam * 100
                    // console.log(88888,this.rate)
                    // this.rate = -100;
                    let list = res.data[0].testPaperInfo[0].sectionExam || [];
                    this.examList = list;
                    console.log(res.msg)
                    console.log('题目列表')
                    console.log(JSON.parse(JSON.stringify(this.examList)));
                    this.$nextTick(() => {
                        // console.log(this.$refs.resultContent.scrollHeight)
                        // console.log(this.$refs.practiceResult)
                        this.$refs.practiceResult.style.height = this.$refs.resultContent.scrollHeight + this.$refs.answerSheet.scrollHeight+20 + 'px'
                    })

                } else {
                    let msg = res.msg || '获取失败'
                    this.$toast(msg)
                }
                this.isLoading = false;
            })
        },

        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                    title: '',
                    message: `确定退出练习结果吗？`,
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
.exam-index {
    font-size: 20px;
    color: #5981F9;
}

.exam-gary {
    color: #999;
    font-size: 13px;
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
        background: #DDFAF3;
        margin-right: 15px;
    }

    .circle-no {
        width: 14px;
        height: 14px;
        border-radius: 7px;
        background: #FFE9EA;
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
            border-radius: 4px;
            margin-bottom: 30px;
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

.practice-result {

    .sheet-button-box {
        /deep/.van-button--info {
            background: #DDFAF3;
            border: 1px solid #DDFAF3;
            color: #22AD7E;
        }

        /deep/.van-button--danger {
            background: #FFE9EA;
            border: 1px solid #FFE9EA;
            color: #E55757;
        }
    }

    .result-content {
        width: 100%;
        position: relative;
        background: #5981F9;
        min-height: 100vh;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        .accord-box {
            position: absolute;
            top: 100px;
            padding-left: 15px;
            background: #5981F9;
            width: 360px;

            // left: 15px;
            .accord {
                background: #fff;
                border-radius: 10px;
                padding: 0 15px;

                min-height: 100px;
                width: 315px;
                padding-top: 70px;

                .circle-white-box {
                    position: absolute;
                    top: -66px;
                    left: 50%;
                    margin-left: -68px;
                    width: 136px;
                    height: 136px;
                    background: #fff;
                    border-radius: 68px;
                    box-shadow: 0px 2px 8px 0px rgba(220, 220, 220, 0.5);

                    .circle-color-box {
                        position: absolute;
                        top: 5px;
                        left: 5px
                    }
                }

                .course-name {
                    color: #5981F9;
                    font-size: 25px;
                    font-weight: 600;
                }

                .course-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 15px;

                    .degree-box {
                        display: flex;
                        align-items: center;

                        /deep/.van-rate__icon {
                            font-size: 20px;
                        }
                    }

                    .course-label {
                        font-size: 16px;
                        font-weight: 500;
                        // margin-right: 15px;
                    }
                }

                .circle-data {
                    padding-top: 20px;

                    .circle-right-num {
                        font-size: 42px;
                        font-weight: 500;
                        color: #22AD7E;
                        margin-top: 30px;
                    }

                    .circle-total-num {
                        font-size: 17px;
                        font-weight: 500;
                        color: #999;
                    }

                }

                .circle-explain {
                    font-size: 12px;
                }

            }
        }

    }

    .van-icon {
        font-size: 20px
    }
}

.answer-sheet {
    margin-top: 35px;

    .answer-sheet-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
    }
}
</style>

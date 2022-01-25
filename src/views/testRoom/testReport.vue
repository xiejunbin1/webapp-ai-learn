<template>
<div class='' style="min-height:100vh;background:#7ED7B9">
    <van-nav-bar fixed placeholder title="测试结果" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='goToTestList' />
            <svg-icon class="fs17" icon-class="icon-cross" @click="goToHome" />
        </template>
    </van-nav-bar>
    <van-pull-refresh v-if="reportData && Object.keys(reportData).length>0" v-model="isLoading" @refresh="onRefresh">
        <div class=''>
            <!-- 本次成绩 -->
            <div class='score-box'>
                <!-- <van-image fit="contain" :src="scoreUrl" /> -->
                <img :src="scoreUrl" class='score-img' alt="">
                <div class='score-name'>本次成绩(分)</div>
                <div class="score">{{reportData.score}}</div>
                <!-- <div class="score" v-if="String(reportData.score).length<=2">{{reportData.score}}</div>
            <div class="score score-long" style="" v-else>{{reportData.score}}</div> -->
                <!-- <div class="fen"  v-if="String(reportData.score).length<=2">分</div>
            <div class="fen fen-long" style="" v-else>分</div> -->
                <!-- 基本信息 -->
                <div class='base-info base-position'>
                    <div class='mgb20'>
                        <svg-icon class="svg" icon-class="icon-test-report-base"></svg-icon>
                        <span class='name'>基本信息</span>
                    </div>
                    <div class='mgt20'>
                        <span class="label-name">测试科目：</span>
                        <span class='label-input'>{{reportData.subjectTypeName}}</span>
                    </div>
                    <div class='mgt20'>
                        <span class="label-name">测试章节：</span>
                        <span class='label-input'>{{reportData.textBookName}} {{reportData.classGrade | getGradeName}} {{reportData.termType | getTermTypeName}} {{reportData.sectionName}}</span>
                    </div>
                    <div class='mgt20'>
                        <span class="label-name">测试时间：</span>
                        <span class='label-input'>{{$moment(reportData.taskDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
                    </div>
                    <div class='mgt20'>
                        <span class="label-name">答题用时：</span>
                        <span class='label-input'>{{Math.floor(reportData.duration/60)}}分{{reportData.duration%60}}秒</span>
                    </div>
                </div>
            </div>

            <!-- 诊断结果等级评定 -->
            <div class='rank-box'>
                <!-- <van-image fit="contain" :src="rankUrl" /> -->
                <img :src="rankUrl" class='rank-img' alt="">
                <div class='title'>
                    <svg-icon class="svg" icon-class="icon-test-report-rank"></svg-icon>
                    <span class='name'>测试结果等级评定</span>
                </div>
                <div class='rank'>{{reportData.rankCode}}</div>
                <div class="rank-name">等级评定</div>
                <div class='rank-detail'>*根据教育部《关于普通高中学业水平考试的实施意见》(教基二[2014]10号)所给的标准，以等级呈现成绩，位次由高到低为A至E等级。其中A等级15%，B等级30%，C等级30%，D，E等级共25%，只能提分系统参照此文件，在义务教育阶段同等适用。</div>
            </div>
            <!-- 测试卷分析 -->
            <div class='base-info'>
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-analysis"></svg-icon>
                    <span class='name'>测试卷分析</span>
                </div>
                <div class='mgt20 item'>
                    <span class="label-name">学科</span>
                    <span class='label-input'>{{reportData.subjectTypeName}}</span>
                </div>
                <div class='mgt20 item'>
                    <span class="label-name">总题数</span>
                    <span class='label-input'>{{reportData.examCount}}</span>
                </div>
                <div class='mgt20 item'>
                    <span class="label-name">总分</span>
                    <span class='label-input'>{{reportData.score}}</span>
                </div>
                <div class='mgt20 item'>
                    <span class="label-name">知识点</span>
                    <span class='label-input'>{{reportData.knowledgePointCount}}</span>
                </div>
                <div class='mgt20 item'>
                    <span class="label-name">难度系数</span>
                    <span class='label-input'>{{reportData.taskDegree | getTitleDegree}}</span>
                </div>
            </div>
            <!-- 知识点掌握情况 -->
            <div class='base-info'>
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-knowPoint"></svg-icon>
                    <span class='name'>知识点掌握情况</span>
                </div>
                <div class="know-box" v-for="(item,index) in reportData.pointViewList" :key="index">
                    <div class='mgt20 know-item'>
                        <span class="item-title">{{item.knowledgePointName}}</span>
                    </div>
                    <div class='mgt20 know-item'>
                        <span class="label-name">总题数</span>
                        <span class='label-input'>{{item.examCount}}</span>
                    </div>
                    <div class='mgt20 know-item'>
                        <span class="label-name">答对数</span>
                        <span class='label-input'>{{item.rightCount}}</span>
                    </div>
                    <div class='mgt20 know-item'>
                        <span class="label-name">答错数</span>
                        <span class='label-input'>{{item.failCount}}</span>
                    </div>
                    <div class='mgt20 know-item'>
                        <span class="label-name">正确率</span>
                        <span class='label-input'>{{(item.rightPercent*100).toFixed(2)}}%</span>
                    </div>
                </div>

            </div>
            <!-- 学习建议 -->
            <!-- T01:微课+练习 -->
            <div class='base-info' v-if="suggestType=='T01'">
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-suggest"></svg-icon>
                    <span class='name'>学习建议</span>
                </div>
                <div class="explain">
                    基于当前报告分析，建议您通过以下微课和练习来巩固章节内容。
                </div>
                <van-tabs v-model="active">
                    <van-tab title="微课学习" v-if="suggestListT01.length>0">
                        <div class='video-box' @click="goToVideo(item)" v-show="item.objectType=='T01'" v-for="(item,index) in suggestListT01.slice(0,suggestLength)" :key="index">
                            <div class='img-box'>
                                <!-- <van-image width="90px" height="65px" :src="item.objectIcon"></van-image> -->
                                <img :src="item.objectIcon" class="object-icon" alt="">
                                <div class='play-icon'>
                                    <svg-icon class="fs34" icon-class="icon-judge-report-play"></svg-icon>
                                </div>
                                <div class="triangle"></div>
                            </div>
                            <div class="title-box">
                                <div class='video-name'>
                                    {{item.sysCourseName}}
                                </div>
                                <div class='learn'>
                                    去学习
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class='more' v-if="!boxshow" @click="checkMoreT01">查看更多</div>
                            <div class='more' v-else @click="checkMoreT01">收起更多</div>
                        </div>
                    </van-tab>
                    <van-tab title="巩固学习" v-if="suggestListT02.length>0">
                        <div class='learn-box' @click="goToPractice(item)" v-show="item.objectType=='T02'" v-for="(item,index) in suggestListT02.slice(0,suggestLength)" :key="index">
                            <div class="title-box">
                                {{item.sysCourseName}}
                            </div>
                            <svg-icon class="fs20" icon-class="icon-judge-report-edit"></svg-icon>
                        </div>
                        <div>
                            <div class='more' v-if="!boxshow" @click="checkMoreT02">查看更多</div>
                            <div class='more' v-else @click="checkMoreT02">收起更多</div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
            <!-- T02:练习卷  -->
            <div class='base-info' v-if="suggestType=='T02'">
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-suggest"></svg-icon>
                    <span class='name'>学习建议</span>
                </div>
                <div class="explain">
                    基于当前报告分析，建议您通过以下练习来巩固章节内容。
                </div>
                <div>
                    <div class='video-learn'>
                        <div class="video-learn-box">
                            <svg-icon class="fs20" icon-class="icon-judge-report-left"></svg-icon>
                            <div class="title">巩固练习</div>
                            <svg-icon class="fs20" icon-class="icon-judge-report-right"></svg-icon>
                        </div>
                    </div>
                    <div class='learn-box' @click="goToPractice(item)" v-for="(item,index) in suggestList.slice(0,suggestLength)" :key="index">
                        <div class="title-box">
                            {{item.sysCourseName}}
                        </div>
                        <svg-icon class="fs20" icon-class="icon-judge-report-edit"></svg-icon>
                    </div>
                    <div>
                        <div class='more' v-if="!boxshow" @click="checkMore">查看更多</div>
                        <div class='more' v-else @click="checkMore">收起更多</div>
                    </div>
                </div>

            </div>
            <!-- T03:诊断卷 -->
            <div class='base-info' v-if="suggestType=='T03'">
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-suggest"></svg-icon>
                    <span class='name'>学习建议</span>
                </div>
                <div class="explain">
                    基于当前报告分析，建议您完成以下诊断卷来获得最优学习方案。
                </div>
                <div>
                    <div class='paper-box' v-for="(item,index) in suggestList.slice(0,suggestLength)" :key="index">
                        <div class='img-box'>
                            <!-- <van-image width="87px" height="102px" :src="paperUrl"></van-image> -->
                            <img :src="paperUrl" class='paper-img' alt="">
                        </div>
                        <div class="title-box">
                            <div class='paper-name'>
                                {{item.sysCourseName}}
                            </div>
                            <div class='degree'>
                                难度：
                                <van-rate color="#FFDD88" v-model="item.suggestDegree=='D01'?2:item.suggestDegree=='D02'?3:4" void-icon="star" void-color="#D8D8D8" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class='more' v-if="!boxshow" @click="checkMore">查看更多</div>
                        <div class='more' v-else @click="checkMore">收起更多</div>
                    </div>
                </div>
            </div>
            <!-- T04:微课 -->
            <div class='base-info' v-if="suggestType=='T04'">
                <div class='mgb20'>
                    <svg-icon class="svg" icon-class="icon-judge-report-suggest"></svg-icon>
                    <span class='name'>学习建议</span>
                </div>
                <div class="explain">
                    基于当前报告分析，您已基本掌握当前章节的知识，建议您学习其他章节内容。
                </div>
                <div>
                    <div class='video-learn'>
                        <div class="video-learn-box">
                            <svg-icon class="fs20" icon-class="icon-judge-report-left"></svg-icon>
                            <div class="title">微课练习</div>
                            <svg-icon class="fs20" icon-class="icon-judge-report-right"></svg-icon>
                        </div>
                    </div>
                    <div class='video-box' @click="goToVideo(item)" v-if="suggestList.length>0" v-for="(item,index) in suggestList.slice(0,suggestLength)" :key="index">
                        <div class='img-box'>
                            <img :src="item.objectIcon" class="object-icon" alt="">
                            <!-- <van-image width="90px" height="65px" src="http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/paper_picture/202103/e16f4a9b-5bb2-4048-910d-c17fe67cf870-1c8c.png?x-oss-process=style/max_width_1000"></van-image> -->
                            <div class='play-icon'>
                                <svg-icon class="fs34" icon-class="icon-judge-report-play"></svg-icon>
                            </div>
                            <div class="triangle"></div>
                        </div>
                        <div class="title-box">
                            <div class='video-name'>
                                {{item.sysCourseName}}
                            </div>
                            <div class='learn'>
                                去学习
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class='more' v-if="!boxshow" @click="checkMore">查看更多</div>
                        <div class='more' v-else @click="checkMore">收起更多</div>
                    </div>
                </div>
            </div>
            <div class='button mgl15 mgr15 pdb20'>
                <van-button round block type="info" @click="toExamAnalysis">查看题目解析</van-button>
            </div>

        </div>
    </van-pull-refresh>
    
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
    getHuiXueTaskDetail,
    getStudySuggestion,
    createHuiXueTask,
    createDiagnosisTask
} from '@/api/teach'
import {
    getSubjectName,
    getGradeName,
} from "@/utils/filter";
import NoResult from "@/components/NoResult"
import {
    getUserLearningInfo
} from "@/api/counter"
export default {
    name: 'testReport',
    components: {
        NoResult
    },
    data() {
        return {
            query: {},
            scoreUrl: require('@/assets/img/testRoom/score-background.png'),
            reportData: {
                pointViewList: [],
                score: 0
            },
            rankUrl: require('@/assets/img/testRoom/rank-background.png'),
            paperUrl: require('@/assets/img/home/paper.png'),
            rankList: [{
                    min: 0,
                    max: 10,
                    rank: 'E'
                },
                {
                    min: 10,
                    max: 25,
                    rank: 'D'
                },
                {
                    min: 25,
                    max: 55,
                    rank: 'C'
                },
                {
                    min: 55,
                    max: 85,
                    rank: 'B'
                },
                {
                    min: 85,
                    max: 100,
                    rank: 'A'
                },
            ],
            active: 0,
            boxshow: false,
            suggestLength: 2,
            value: 3,
            suggestType: '',
            suggestList: [],
            suggestListT01: [],
            suggestListT02: [],
            suggestLengthT01: 2,
            suggestLengthT02: 2,
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
            isLoading: false,
            diffLevel: 0
        };
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
        }),
    },
    watch: {},
    created() {

    },
    mounted() {
        this.reportData = {}
        this.query = this.$route.query
        this.getHuiXueTaskDetail()
        this.getStudySuggestion()
    },
    activated() {},
    beforeDestroy() {},
    destroyed() {},
    methods: {
        onRefresh() {
            this.getHuiXueTaskDetail()
            this.getStudySuggestion()
        },
        // 微课学习
        goToVideo(item) {
            console.log(item)
            if (item.sysCourseId) {
                this.$router.push({
                    name: 'videoPractice',
                    query: {
                        subjectType: this.reportData.subjectType,
                        id: item.sysCourseId,
                        textBookId: this.reportData.textBookId,
                        termType: this.reportData.termType
                    }
                })
            } else {
                this.$toast('暂无微课信息')
            }
        },
        //巩固练习
        goToPractice(item) {
            //命名规则：年级学科+练习+年月日时分
            const taskName = getGradeName(this.reportData.classGrade) + getSubjectName(this.reportData.subjectType) + '练习' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": this.reportData.subjectType,
                "classGrade": this.reportData.classGrade,
                "termType": this.reportData.termType,
                "sysCourseIdList": this.reportData.sysCourseId,
                "examRuleList": [{
                    "type": "T01", //选择题
                    "cnt": 20, //20道
                    "score": 5 //每道5分
                }],
                "shareType": 'S03',
                "diffLevel": null,
                "degree": this.reportData.taskDegree,
                "duration": 0, //写死
                "taskName": taskName,
                "taskType": 'T23', //练习
                "usedList": [{
                    resourceType: 'R97', //章节
                    resourceId: this.reportData.sectionId
                }, ]
            }
            console.log('params', params)
            // return
            this.createHuiXueTask({
                params: params,
                success: (res) => {
                    let query = {
                        taskId: res.data.taskId,
                        tchCourseId: res.data.tchCourseId,
                    }
                    this.$router.push({
                        path: '/togetherPractice',
                        query: query
                    })
                }
            })
        },
        //诊断任务
        goToJudge(item) {
            console.log(JSON.parse(JSON.stringify(item)));
            this.getUserLearningInfo({
                success: () => {
                    this.createDiagnosisTask(item)
                }
            })
        },
        //创建诊断任务
        createDiagnosisTask(item) {
            //命名规则：年级学科+诊断+年月日时分
            const taskName = getGradeName(this.reportData.classGrade) + getSubjectName(this.reportData.subjectType) + '诊断' + this.$moment().format('YYYYMMDDHHmm')
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "subjectType": this.reportData.subjectType,
                "classGrade": this.reportData.classGrade,
                "termType": this.reportData.termType,
                "sysCourseIdList": this.reportData.sysCourseId,
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
                        resourceId: this.reportData.sectionId
                    },
                    {
                        resourceType: 'R98', //版本
                        resourceId: this.reportData.textBookId
                    },
                ],
                graspCount: this.reportData.graspCount,
                testPaperId: item.objectId
            }
            createDiagnosisTask(params).then(res => {
                if (res.flag) {
                    let query = {
                        taskId: res.data.taskId,
                        tchCourseId: res.data.tchCourseId,
                        // sectionName:this.sectionName,
                        // subjectType:this.query.subjectType,
                        // textBookName:this.query.textBookName,
                        // termTypeName:this.termTypeName
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
        getUserLearningInfo(obj) {
            const params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "sysCourseIdList": this.reportData.sysCourseId,
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
        sureType(item) {
            this.diffLevel = item.key;
            this.showType = false;
            this.createDiagnosisTask()
        },
        //创建练习任务
        createHuiXueTask(obj) {
            //命名规则：年级学科+练习+年月日时分
            // const taskName = getGradeName(practiceItem.classGrade) + getSubjectName(practiceItem.subjectType) + '练习' + this.$moment().format('YYYYMMDDHHmm')
            // const params = {
            //     "interUser": "runLfb",
            //     "interPwd": "25d55ad283aa400af464c76d713c07ad",
            //     "accountNo": this.getUserInfo.accountNo,
            //     "subjectType": practiceItem.subjectType,
            //     "classGrade": practiceItem.classGrade,
            //     "termType": practiceItem.termType,
            //     "sysCourseIdList": [courseItem.courseId],
            //     "examRuleList": [{
            //         "type": "T01", //选择题
            //         "cnt": 20, //20道
            //         "score": 5 //每道5分
            //     }],
            //     "shareType": 'S03',
            //     "diffLevel": null,
            //     "degree": practiceItem.courseDegree,
            //     "duration": 0, //写死
            //     "taskName": taskName,
            //     "taskType": 'T23', //练习
            //     "usedList": [{
            //             resourceType: 'R97', //章节
            //             resourceId: item.nodeId
            //         },
            //         // {
            //         //     resourceType:'R98',//版本
            //         //     resourceId:this.query.textBookId
            //         // },
            //     ]
            // }
            // return
            console.log('params', obj.params)
            createHuiXueTask(obj.params).then(res => {
                if (res.flag) {
                    obj.success && obj.success(res)
                } else {
                    let msg = res.msg || '创建失败';
                    this.$toast(msg)
                }
            })
        },
        goToTestList() {
            if (this.query.recordingId) { //返回上一页的标志
                this.$router.go(-1)
            } else {
                this.$router.push({
                    path: '/testList'
                })
            }
        },
        checkMoreT01() {
            this.boxshow = !this.boxshow
            this.suggestLengthT01 = this.suggestLengthT01 == 2 ? this.suggestLengthT01.length : 2
            this.suggestListT01 = JSON.parse(JSON.stringify(this.suggestListT01))
            // console.log(this.suggestLength,JSON.parse(JSON.stringify(this.suggestList)))
        },
        checkMoreT02() {
            this.boxshow = !this.boxshow
            this.suggestLengthT02 = this.suggestLengthT02 == 2 ? this.suggestLengthT02.length : 2
            this.suggestListT02 = JSON.parse(JSON.stringify(this.suggestListT02))
            // console.log(this.suggestLength,JSON.parse(JSON.stringify(this.suggestList)))
        },
        checkMore() {
            this.boxshow = !this.boxshow
            this.suggestLength = this.suggestLength == 2 ? this.suggestList.length : 2
            this.suggestList = JSON.parse(JSON.stringify(this.suggestList))
            // console.log(this.suggestLength,JSON.parse(JSON.stringify(this.suggestList)))
        },
        getRankCode() {
            if (this.reportData.score == 0) {
                this.reportData.rankCode = 'E'
            } else {
                for (var i = 0; i < this.rankList.length; i++) {
                    let item = this.rankList[i];

                    if (this.reportData.score <= item.max && this.reportData.score > item.min) {
                        // console.log('rank', item, this.reportData.score < item.max, this.reportData.score >= item.min)
                        this.reportData.rankCode = item.rank;
                        break;
                    }
                }
            }
        }, 
        //查看题目解析
        toExamAnalysis() {
            this.$router.push({
                path: '/examAnalysis',
                query: {
                    taskId: this.query.taskId,
                    tchCourseId: this.reportData.tchCourseId
                }
            })
        },
        getHuiXueTaskDetail(obj = {}) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "taskId": this.query.taskId,
            }
            getHuiXueTaskDetail(params).then(res => {
                if (res.flag) {
                    this.reportData = res.data || {}
                    // this.reportData.score = 30;
                    // this.reportData.pointViewList=this.reportData.pointViewList.splice(0,this.suggestLength)
                    this.reportData.textBookName = this.reportData.usedViews.filter((item) => item.resourceType == 'R98')[0].resourceName //R98代表版本信息
                    this.reportData.textBookId = this.reportData.usedViews.filter((item) => item.resourceType == 'R98')[0].resourceId //R98代表版本信息
                    this.reportData.sectionName = this.reportData.usedViews.filter((item) => item.resourceType == 'R97')[0].resourceName //R97代表章节信息
                    this.reportData.sectionId = this.reportData.usedViews.filter((item) => item.resourceType == 'R97')[0].resourceId //R97代表章节信息
                    this.getRankCode()
                    // this.reportData={}
                } else {
                    let msg = res.msg || '获取失败'
                    this.$toast(msg)
                }
                this.isLoading = false;
            })
        },
        getStudySuggestion(obj = {}) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "taskId": this.query.taskId,
            }
            getStudySuggestion(params).then(res => {
                if (res.flag) {
                    // this.reportData = res.data || {}
                    // this.reportData.pointViewList=this.reportData.pointViewList.splice(0,this.suggestLength)
                    // this.getRankCode()
                    this.suggestList = res.data || [];
                    this.suggestListT01 = this.suggestList.filter((item) => item.objectType == 'T01')
                    this.suggestListT02 = this.suggestList.filter((item) => item.objectType == 'T02')
                    if (res.data && res.data[0]) {
                        this.suggestType = res.data[0].suggestType
                    }
                    //测试用
                    // this.suggestType ='T04'
                } else {
                    let msg = res.msg || '提交失败'
                    this.$toast(msg)
                }
            })
        },
        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                    title: '',
                    message: `确定退出测试结果吗？`,
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
    },
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.score-box {
    position: relative;
    margin-bottom: 15px;
    height: 570px;

    // background:#E7F2FF;
    // border-radius: 8px;
    // overflow: hidden;
    .score-img {
        width: 100%;
        // box-shadow: 0 2px 8px 0 rgba(128,175,229,0.5);
        // border-radius: 6px;
    }

    // box-shadow: 0 2px 8px 0 #80AFE5;
    .score-name {
        position: absolute;
        top: 180px;
        left: 50%;
        margin-left: -70px;
        color: #004F34;
        font-size: 18px;
        font-weight: 500;
        width: 140px;
        display: flex;
        color: #fff;
        justify-content: center;
    }

    .score {
        color: #FBFF3E;
        font-size: 85px;
        position: absolute;
        top: 80px;
        font-weight: 400;
        text-shadow: 0px 7px 7px #1A9F72;
        width: 140px;
        // margin: 0 auto;
        left: 50%;
        margin-left: -70px;
        display: flex;
        justify-content: center;
    }
    .score-long {
        left: 130px;
    }
    .fen {
        font-size: 13px;
        position: absolute;
        top: 80px;
        left: 195px;
    }

    .fen-long {
        left: 205px;
        top: 75px;
    }
}

.base-info {
    background: #fff;
    padding: 25px 15px;
    border-radius: 6px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px 0 rgba(39, 166, 121, 1);
    margin: 0 15px 15px;

    .svg {
        font-size: 20px;
        margin-right: 10px;
    }

    .name {
        font-size: 20px;
        font-weight: 500;
    }

    .label-name {
        font-size: 15px;
        font-weight: 500;
    }

    .label-input {
        font-size: 15px;
        color: #666;
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 0 25px;
    }

    .explain {
        font-size: 12px;
        color: #999;
    }

    .know-box {
        border-bottom: 1px solid #DDDDDD;
        margin: 0 25px;
        padding-bottom: 20px;

        .know-item {
            display: flex;
            justify-content: space-between;

            .item-title {
                font-size: 17px;
                color: #5981F9;
                font-weight: 500;
            }
        }
    }

    .know-box:last-child {
        border-bottom: 0px solid #DDDDDD;
    }

    /deep/.van-tab {
        color: #aaa;
        font-size: 16px;
    }

    /deep/.van-tab--active {
        color: #5981F9
    }

    /deep/.van-tabs__line {
        background: #5981F9;
    }

    .video-learn {
        display: flex;
        justify-content: center;
        padding-top: 20px;

        .video-learn-box {
            display: flex;

            .title {
                margin: 0 20px;
                font-size: 16px;
                font-weight: 500;
            }
        }

    }

    .video-box {
        display: flex;
        background: #F9F9F9;
        border-radius: 4px;
        margin-top: 15px;
        padding: 10px;

        .img-box {
            height: 65px;
            width: 90px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;

            .object-icon {
                width: 90px;
                height: 65px;
            }

            .play-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -17px;
                margin-top: -17px;
            }
        }

        .title-box {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            padding: 7px 10px;
            font-size: 13px;

            .video-name {
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 200px;
            }

            .learn {
                color: #666;
                font-weight: 400;
            }
        }
    }

    .learn-box {
        display: flex;
        background: #F9F9F9;
        border-radius: 4px;
        margin-top: 15px;
        padding: 18px 15px;
        justify-content: space-between;

        .title-box {
            font-size: 13px;
            font-weight: 500;
        }
    }

    .paper-box {
        display: flex;
        background: #F9F9F9;
        border-radius: 4px;
        margin-top: 15px;
        padding: 15px;

        .img-box {
            height: 102px;
            width: 87px;
            border-radius: 4px;
            overflow: hidden;

            // position: relative;
            .paper-img {
                height: 102px;
                width: 87px;
            }
        }

        .title-box {
            padding: 14px 0 14px 25px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            .paper-name {
                font-size: 17px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 160px;
            }

            .degree {
                font-size: 14px;
                font-weight: 400;
                display: flex;
                align-items: center;

                /deep/.van-rate__icon {
                    font-size: 20px;
                }
            }
        }
    }

    .more {
        color: #5981F9;
        font-size: 15px;
        padding: 20px;
        text-align: center;
    }

}

.base-position {
    position: absolute;
    bottom: 0px;
    width: 315px;
    margin-bottom: 0;
}

.rank-box {
    margin-bottom: 15px;
    position: relative;
    border-radius: 6px;
    margin: 0 15px 15px;

    .rank-img {
        width: 100%;
        box-shadow: 0 2px 8px 0 rgba(39, 166, 121, 1);
        border-radius: 6px;
    }

    .title {
        position: absolute;
        top: 20px;
        left: 15px;

        // background: #666;
        .svg {
            font-size: 20px;
            margin-right: 10px;
        }

        .name {
            font-size: 18px;
            font-weight: 500;
            // color: #fff;
        }
    }

    .rank {
        position: absolute;
        top: 120px;
        left: 155px;
        // color: #fff;
        font-size: 40px;
    }

    .rank-name {
        position: absolute;
        top: 165px;
        left: 140px;
        // color: #fff;
        font-size: 15px;
    }

    .rank-detail {
        // color: #fff;
        font-size: 12px;
        position: absolute;
        top: 200px;
        left: 15px;
        width: 315px;
        line-height: 18px;
    }

}

.box {
    // height:30px;
    // width: 200px;
    // background-color:black;
    border: 1px solid #5981F9;
    overflow: hidden;
}

.boxShow {
    height: 100%;
}
</style>

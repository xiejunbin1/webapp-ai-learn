<template>
<div class='judge-learning-title'>
    <van-nav-bar fixed placeholder  :title="pageName" left-text="">
        <template #left>
            <svg-icon  class='mgr10 fs15' icon-class="icon-arrow-left" @click='onClickLeft' />
            <svg-icon class='fs17' icon-class="icon-cross" @click="goToHome" />
        </template>
        <template #right>
            <svg-icon class='fs27' icon-class="icon-judge-sheet" @click='showAnswerSheet' />
        </template>
    </van-nav-bar>
    <div v-if="examList && examList.length>0" style="padding: 15px;margin-bottom: 80px;overflow:hidden">
        <div>
            <div>
                <span class='exam-index'>{{examIndex+1}}</span>
                <span class='mgr10 exam-gary'>/{{examList.length}}</span>
                <span class="exam-gary">（综合难度：{{examList[examIndex].examQuestion.titleDegree | getTitleDegree}}）</span>
            </div>
            <div class="lh30" v-html="examList[examIndex].examQuestion.title">

            </div>
            <div class='analysis-box'>
                <div class='answer-analysis '>
                    <span class="mgr10">答案解析</span>
                </div>
                <div class="student-answer">
                    <span class="mgr10">你的答案</span>
                    <svg-icon class="" :icon-class="examList[examIndex].examQuestion.isRight == 'I01'?'icon-answer-right':'icon-answer-wrong'"></svg-icon>
                </div>
                <div class='mgb15' v-html="examList[examIndex].examQuestion.studentAnswer"></div>
                <div class='right-answer'>正确答案</div>
                <div class='mgb15' v-html="examList[examIndex].examQuestion.answer"></div>
                <div class='analysis'>解析</div>
                <div class="lh30" v-html="examList[examIndex].examQuestion.examExplain"></div>
            </div>
        </div>

    </div>
    <div v-if="examList && examList.length>0" class='answer-box'>
        <van-button v-show="examIndex!=0 && examIndex==examList.length-1" round block plain type="info"  @click="prevExam">上一题</van-button>
        <van-button v-show="examIndex==0" round block plain type="info"  @click="nextExam">下一题</van-button>
        <van-button class="w160" v-show="examIndex!=0 && examIndex!=examList.length-1" round plain type="info"  @click="prevExam">上一题</van-button>
        <van-button class="w160" v-show="examIndex!=0 && examIndex!=examList.length-1" round plain type="info"  @click="nextExam">下一题</van-button>
        <!-- <van-button class='answer-box-button' :type="examList[examIndex].examQuestion.answer == oItem.value?'info':(examList[examIndex].examQuestion.studentAnswer == oItem.value && examList[examIndex].examQuestion.isRight == 'I03'?'danger':'default')" v-for="(oItem,oIndex) in optionList.slice(0,examList[examIndex].examQuestion.optionCount)" :key="oIndex">{{oItem.code}}</van-button> -->
    </div>
    <NoResult class='all-center' v-else></NoResult>
    <!-- 答题卡 -->
    <van-action-sheet v-model="showType" title="答题卡" class='answer-sheet'>
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
                <van-button  class='item-button mgb20' plain :type="item.examQuestion.isRight == 'I01'?'info':'danger'" @click="chooseExam(index)">{{index+1}}</van-button>
                <div class='now' v-if="examIndex == index">当前</div>
            </div>
            <!-- 解决最后一行不满时没有左对齐问题     +'00'，不然key和上边的div冲突了
            参考：https://blog.csdn.net/Storm_Bluecat/article/details/115251736 -->
            <div class="default-box" v-for="n in 10" :key="n+'00'"></div>
        </div>
    </van-action-sheet>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getCourseTaskDetail,
} from '@/api/teach'
import NoResult from "@/components/NoResult"
export default {
    name: 'examAnalysis',
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
            examIndex: 0,
            showType: false,
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
            pageName:''
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
    },
    created() {

    },
    mounted() {
        this.examList = []
        this.query = this.$route.query;
        this.getCourseTaskDetail();
        this.pageName = this.query.pageName || '题目解析'
        this.examIndex = isNaN(this.query.examIndex)?0:Number(this.query.examIndex)
    },
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeDestroy() {},
    destroyed() {
    },
    methods: {
        //上一题
        prevExam(){
            this.examIndex -= 1;
        },
        //下一题
        nextExam(){
            this.examIndex += 1;
        },
        showAnswerSheet() {
            this.showType = true;
        },
        chooseExam(index) {
            this.examIndex = index;
            this.showType = false;
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
                } else {
                    let msg = res.msg || '获取失败'
                    this.$toast(msg)
                }
            })
        },
        
        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                title: '',
                message: `确定退出${this.pageName}吗？`,
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
.exam-index {
    font-size: 20px;
    color: #5981F9;
}

.exam-gary {
    color: #999;
    font-size: 13px;
}
.analysis-box{
    background: #f8f8f8;
    border-radius: 5px;
    padding: 15px;
    .answer-analysis{
        font-size: 17px;
        font-weight: 500;
        margin-bottom: 15px;
    }
    .student-answer{
        font-size: 15px;
        font-weight: 400;
        margin-bottom: 15px;
    }
    .right-answer{
        font-size: 15px;
        color:#22AD7E;
        font-weight: 400;
        margin-bottom: 15px;
    }
    .analysis{
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
    .answer-box-button{
        width: 70px;
        height: 40px;
        border-radius: 4px;
    }
    /deep/.van-button--plain.van-button--info {
        background: #EAF0FF;
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
        .item-button{
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
            bottom: 10px;
        }
    }
    .default-box{
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
    
}
.answer-sheet{
    height: 500px;
    
    /deep/.van-button--info {
        background: #DDFAF3;
        border: 1px solid #DDFAF3;
        color:#22AD7E;
    }

    /deep/.van-button--danger{
        background: #FFE9EA;
        border: 1px solid #FFE9EA;
        color:#E55757;
    }
    
}
</style>

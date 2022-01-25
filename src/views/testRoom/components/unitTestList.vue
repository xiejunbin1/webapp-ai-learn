<template>
<div class="unitTest" v-if="unitTestList && unitTestList.length>0">
    <div v-for="(value,index) in unitTestList" :key="index">
        <span class="title">{{ value.nodeName }}</span>
        <div class="unitTest_div" v-if="value.tchUserCourseRelationVo && value.tchUserCourseRelationVo.length>0">
            <div class="icon-unitTest">单元测</div>
        </div>
        <div class="unitTestClass" v-if="value.tchUserCourseRelationVo && value.tchUserCourseRelationVo.length>0">
            <div class='unitTest_span' v-for="(item,index) in value.tchUserCourseRelationVo" :key="index" @click="goToTest(value,item)">
                <div class="difficulty">难度：</div>
                <div class="van-rate">
                    <van-rate color="#ffd21e" v-if="item.courseDegree=='D01'" v-model="courseDegree2" />
                    <van-rate color="#ffd21e" v-if="item.courseDegree=='D02'" v-model="courseDegree3" />
                    <van-rate color="#ffd21e" v-if="item.courseDegree=='D03'" v-model="courseDegree4" />
                </div>
                <div class="startTesting">{{getTestingName(item)}}</div>
            </div>
        </div>
        <div class="unitTest_" v-if="!value.tchUserCourseRelationVo">
            <div class="unitTest_div1">完成微课学习后，系统将推送配套测试</div>
            <div class="unitTest_div2" @click="goToVideo(value)">立即学习微课</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: '',
    components: {},
    props:{
        unitTestList:{
            type:Array,
            default:[]
        }
    },
    data() {
        return {
            courseDegree2:2,
            courseDegree3:3,
            courseDegree4:4
        };
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {

    },
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeDestroy() {},
    destroyed() {},
    methods: {
        //测试状态
        getTestingName(item) {
            let testingName = ''
            if (item.lastTaskId == 0) {
                testingName = '开始测试'
            } else {
                if (item.lastTaskFinishStatus == 'S01' || item.lastTaskFinishStatus == 'S02') {
                    testingName = '继续测试'
                } else if (item.lastTaskFinishStatus == 'S03') {
                    testingName = '重新测试'
                }
            }
            return testingName
        },
        goToTest(item,courseItem){
            let obj={
                item:item,
                courseItem:courseItem
            }
            this.$emit('goToTest',obj)
        },
        goToVideo(item){
            this.$emit('goToVideo',item)
        }
    },
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.unitTest {
    width: 92%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px 0 rgba(220, 220, 220, 0.5);
    margin: 0 auto;
    margin-top: 20px;
    // margin-bottom: 20px;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        position: absolute;
        left: 15px;
    }

    .unitTest_div {
        height: 100%;
        display: flex;
        justify-content: center;
        margin-top: 45px;
        text-align: center;

        .icon-unitTest {
            font-size: 80px;
            width: 136px;
            height: 18px;
            background: url('../../../assets/img/testRoom/unitTest.png') no-repeat center center;
            background-size: cover;
            /*background-size 一般单独写*/
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            text-align: center;
            line-height: 18px;
        }

    }

    .unitTestClass {
        display: flex;
        justify-content: space-around;
        box-sizing: border-box;
        margin-top: 30px;

        .unitTest_span1 {
            width: 100px;
            height: 112px;
            background: url('../../../assets/img/testRoom/difficulty1.png') no-repeat center center;
            background-size: cover;
            /*background-size 一般单独写*/
            padding-left: 10px;
            box-sizing: border-box;

            .difficulty {
                font-size: 13px;
                font-weight: 500;
                color: #333333;
                padding-top: 15px;
                box-sizing: border-box;
            }

            .van-rate {
                box-sizing: border-box;
                margin-top: 5px;
            }

            .startTesting {
                font-size: 13px;
                font-weight: 400;
                color: #333333;
                margin-top: 10px;
            }
        }

        .unitTest_span2 {
            width: 100px;
            height: 112px;
            background: url('../../../assets/img/testRoom/difficulty2.png') no-repeat center center;
            background-size: cover;
            /*background-size 一般单独写*/
            padding-left: 10px;
            box-sizing: border-box;

            .difficulty {
                font-size: 13px;
                font-weight: 500;
                color: #333333;
                padding-top: 15px;
                box-sizing: border-box;
            }

            .van-rate {
                box-sizing: border-box;
                margin-top: 5px;
            }

            .startTesting {
                font-size: 13px;
                font-weight: 400;
                color: #333333;
                margin-top: 10px;
            }
        }

        .unitTest_span {
            width: 100px;
            height: 112px;
            background: url('../../../assets/img/testRoom/difficulty.png') no-repeat center center;
            background-size: cover;
            /*background-size 一般单独写*/
            padding-left: 10px;
            box-sizing: border-box;

            .difficulty {
                font-size: 13px;
                font-weight: 500;
                color: #333333;
                padding-top: 15px;
                box-sizing: border-box;
            }

            .van-rate {
                box-sizing: border-box;
                margin-top: 5px;

                /deep/.van-rate__icon {
                    font-size: 15px;
                }
            }

            .startTesting {
                font-size: 13px;
                font-weight: 400;
                color: #333333;
                margin-top: 10px;
            }
        }
    }

    .unitTest_ {
        display: flex;
        justify-content: space-around;
        margin-top: 45px;
        box-sizing: border-box;
        background: #f8f8f8;
        width: 100%;
        height: 92px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .unitTest_div1 {
            font-size: 13px;
            font-weight: 500;
            color: #333333;
        }

        .unitTest_div2 {
            font-size: 15px;
            font-weight: 400;
            color: #5981F9;
        }
    }

}

.unitTest>div {
    width: 100%;
    margin-top: 20px;
}
</style>

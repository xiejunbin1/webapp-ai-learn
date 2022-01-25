<template>
<div class='' v-if="unitTestList && unitTestList.length>0">
    <div class='unit-test-box' v-for="(item,index) in unitTestList" :key="index">
        <div class='unit-name'>
            {{item.nodeName}}
        </div>
        <div class="course-box" v-for="(courseItem,courseIndex) in item.children" :key="courseIndex">
            <div v-if="courseItem.tchUserCourseRelationVo && courseItem.tchUserCourseRelationVo.length>0">
                <div class="course-name">
                    {{courseItem.nodeName}}
                    <span class="course-video" @click="goToVideo(courseItem)">微课</span>
                </div>
                <div class='video-box' v-if="courseItem.videoName">
                    <div class='img-box'>
                        <!-- <van-image width="90px" height="65px" :src="item.objectIcon"></van-image> -->
                        <img :src="courseItem.videoImg" class="object-icon" alt="">
                        <div class='play-icon'>
                            <svg-icon class="fs34" icon-class="icon-judge-report-play"></svg-icon>
                        </div>
                        <div class="triangle"></div>
                    </div>
                    <div class="title-box">
                        <div class='video-name'>
                            {{courseItem.videoName}}
                        </div>
                        <div class='learn'>
                            去学习
                        </div>
                    </div>
                </div>
                <div v-if="courseItem.tchUserCourseRelationVo">
                    <div class='together-practice'>同步练</div>
                    <div class='practice-box' @click="goToTest(item,courseItem,practiceItem)" v-for="(practiceItem,practiceIndex) in courseItem.tchUserCourseRelationVo" :key="practiceIndex">
                        <img class="practice-img" :src="require(`@/assets/img/practice/practice-${getPracticeTypeName(practiceItem)}.png`)" alt="">
                        <div class="practice-name">{{getPracticeTypeName(practiceItem) | getPracticeTypeName}}</div>
                        <van-rate class="pdr15" color="#FFDD88" v-if="practiceItem.courseDegree=='D01'" v-model="courseDegree2" void-icon="star" void-color="#D8D8D8" />
                        <van-rate class="pdr15" color="#FFDD88" v-if="practiceItem.courseDegree=='D02'" v-model="courseDegree3" void-icon="star" void-color="#D8D8D8" />
                        <van-rate class="pdr15" color="#FFDD88" v-if="practiceItem.courseDegree=='D03'" v-model="courseDegree4" void-icon="star" void-color="#D8D8D8" />
                    </div>
                </div>
            </div>

            <div v-else>
                <van-cell center value="" is-link @click="goToVideo(courseItem)">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                        <div class="course-name" style="margin-bottom:0">
                            {{courseItem.nodeName}}
                        </div>
                        <div>
                            <svg-icon class="fs15 mgr10" icon-class="icon-practice-lock"></svg-icon>
                            <span class="defalut-detail">查看微课后解锁同步练习</span>
                        </div>
                    </template>
                    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                    <template #right-icon>
                        <span style="color:#6288F8">微课</span>
                        <svg-icon icon-class="icon-arrow-right-blue"></svg-icon>
                    </template>
                </van-cell>

            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: '',
    components: {},
    props: {
        unitTestList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            courseDegree2: 2,
            courseDegree3: 3,
            courseDegree4: 4
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
        getPracticeTypeName(item) {
            let type = ''
            if (item.lastTaskId == 0) {
                type = 'P01'
            } else {
                if (item.lastTaskFinishStatus == 'S01' || item.lastTaskFinishStatus == 'S02') {
                    type = 'P02'
                } else if (item.lastTaskFinishStatus == 'S03') {
                    type = 'P03'
                }
            }
            return type
        },
        goToVideo(item) {
            this.$emit('goToVideo', item)
        },
        goToTest(item, courseItem, practiceItem) {
            let obj = {
                item,
                courseItem,
                practiceItem
            }
            this.$emit('goToTest', obj)
        }
    },
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.unit-test-box {
    padding: 20px 15px 0 15px;

    .unit-name {
        font-size: 18px;
        font-weight: 500;
        padding-bottom: 20px;
    }

    .course-box {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px 0 rgba(220, 220, 220, 0.5);
        padding: 20px 15px;
        margin-bottom: 15px;

        .course-name {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 200px;
            white-space: nowrap;

            .course-video {
                color: #5981F9;
                margin-left: 15px;
                font-size: 18px;
            }
        }

        .defalut-detail {
            font-size: 13px;
            color: #aaa;
            font-weight: 400;
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

        .together-practice {
            padding: 15px 0;
            font-weight: 500;
            font-size: 15px;
        }

        .practice-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            height: 45px;
            margin-bottom: 15px;

            .practice-img {
                position: absolute;
                top: 0;
                z-index: 0;
                height: 45px;
                width: 315px;
            }

            .practice-name {
                z-index: 20;
                padding-left: 15px;
                font-size: 13px;
                font-weight: 400;
            }

            /deep/.van-rate__icon {
                font-size: 15px;
            }
        }

        /deep/.van-cell__title {
            // flex: 2;
            flex-grow: 3;
        }

        /deep/.van-cell__value {
            // flex: 2;
            flex-grow: 1;
        }

        /deep/.van-cell {
            padding: 0;
        }
    }
}

.unit-test-box:last-of-type {
    padding-bottom: 20px;
}
</style>

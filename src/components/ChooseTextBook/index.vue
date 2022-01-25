<template>
<div class="tou">
    <div style="position: relative;">
        <div class="tou-return" style="" @click="onClickLeft">
            <van-icon name="arrow-left" slot="left" />
        </div>
        <div class="tabs">
            <van-tabs v-model="active" @click="changeSubject" sticky>
                <van-tab v-for="(value,index) in subjectList" :key="index" :title="value.subjectTypeName" v-show="subjectList&&subjectList.length>0">
                    <div class="secretary">
                        <div class="image" style="">
                            <img :src="textBookObj.subjectTypeName | changeTheTeachingPicture" alt="">
                            <span class="subjectClss">{{ textBookObj.subjectTypeName }}</span>
                            <div class="ageversion">
                                <div>
                                    {{textBookObj.classGrade | getGradeName}}
                                </div>
                                <div>
                                    {{textBookObj.termTypeName}}</div>
                            </div>
                        </div>
                        <div class="secretary-left">
                            <div style="font-weight: 500;">{{textBookObj.textBookName}}{{textBookObj.classGrade | getGradeName}}{{textBookObj.subjectTypeName}}{{textBookObj.termTypeName}}</div>
                            <div @click="switchVersion">切换版本</div>
                        </div>
                    </div>
                    <slot name="content"></slot>
                </van-tab>
            </van-tabs>
        </div>

    </div>
</div>
</template>

<script>
export default {
    name: 'chooseTextBook',
    components: {},
    props: {
        subjectList: { //学科列表
            type: Array,
            default: []
        },
        textBookObj: { //教材版本信息
            type: Object,
            default: {}
        },
        subjectActiveIndex: { //当前选中的学科index
            type: Number,
            defalut: 0
        }
    },
    data() {
        return {

        };
    },
    computed: {
        active: {
            get() {
                return this.subjectActiveIndex
            },
            set(val) {
                this.$emit('update:subjectActiveIndex', val)
            }
        },
    },
    watch: {},
    created() {

    },
    mounted() {

    },
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    beforeDestroy() {},
    destroyed() {},
    methods: {
        onClickLeft() {
            this.$emit('onClickLeft')
        },
        changeSubject(name, title) {
            this.$emit('changeSubject',title)
        },
        switchVersion() {
            this.$emit('switchVersion')
        },
    },
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
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
                align-items: center;

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

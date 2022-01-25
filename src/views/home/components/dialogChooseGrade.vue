<template>
<div class=''>
    <van-popup round v-model="isShowDialog" class="choose-grade-popup">
        <div class='title'>
            当前就读年级
        </div>
        <div>
            <div v-for="(item,index) in allGradeList" :key="index">
                <div class='year-name'>{{item.yearSectionName}}</div>
                <div class='grade-box'>
                    <div :class="{'grade-item':true,'active':grade==itemChild.grade}" @click="sureChooseGrade(itemChild)" v-for="(itemChild,indexChild) in item.gradeList" :key="indexChild" type="default">{{itemChild.gradeName}}</div>
                </div>
            </div>
        </div>
    </van-popup>
</div>
</template>

<script>
export default {
    name: '',
    components: {},
    props: {
        showChooseGrade: {
            type: Boolean,
            default: false
        },
        chooseGrade: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            allGradeList: [{
                    yearSection: 'Y01',
                    yearSectionName: '小学',
                    gradeList: [{
                            grade: 'G01',
                            gradeName: '一年级'
                        },
                        {
                            grade: 'G02',
                            gradeName: '二年级'
                        },
                        {
                            grade: 'G03',
                            gradeName: '三年级'
                        },
                        {
                            grade: 'G04',
                            gradeName: '四年级'
                        },
                        {
                            grade: 'G05',
                            gradeName: '五年级'
                        },
                        {
                            grade: 'G06',
                            gradeName: '六年级'
                        },
                    ]
                },
                {
                    yearSection: 'Y02',
                    yearSectionName: '初中',
                    gradeList: [{
                            grade: 'G07',
                            gradeName: '初一'
                        },
                        {
                            grade: 'G08',
                            gradeName: '初二'
                        },
                        {
                            grade: 'G09',
                            gradeName: '初三'
                        }
                    ]
                },
                {
                    yearSection: 'Y03',
                    yearSectionName: '高中',
                    gradeList: [{
                            grade: 'G10',
                            gradeName: '高一'
                        },
                        {
                            grade: 'G11',
                            gradeName: '高二'
                        },
                        {
                            grade: 'G12',
                            gradeName: '高三'
                        }
                    ]
                },
            ],
        };
    },
    computed: {
        isShowDialog: {
            get() {
                return this.showChooseGrade
            },
            set(val) {
                console.log(val)
                this.$emit('update:showChooseGrade', val) 
            }
        },
        grade: {
            get() {
                return this.chooseGrade
            },
            set(val) {
                console.log(val)
                this.$emit('update:chooseGrade', val)
            }
        },
    },
    watch: {},
    methods: {
        sureChooseGrade(item) {
            this.grade = item.grade
            this.$emit('sureChooseGrade', this.grade)
        }
    },
    created() {

    },
    mounted() {

    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.choose-grade-popup{
    width: 280px;
    padding: 25px 20px;
}
.title {
    text-align: center;
    color: #333;
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 20px;
}

.year-name {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
    font-weight: 500;
}

.grade-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .grade-item {
        width: 85px;
        height: 40px;
        border: 1px solid #979797;
        border-radius: 2px;
        font-size: 15px;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }

    .active {
        border: 1px solid #5981F9;
        color: #5981F9;
        background: #EFF3FF;
    }
}
</style>

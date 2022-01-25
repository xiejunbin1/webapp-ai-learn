<template>
<div class=''>
    <van-nav-bar fixed placeholder title="诊断学情" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='onClickLeft' />
            <svg-icon class="fs17" icon-class="icon-cross" @click="goToHome" />
        </template>
    </van-nav-bar>
    <div class="subject-content" v-if="subjectList && subjectList.length>0">
        <div class='choose'>请选择科目</div>
        <div class='box' >
            <div :class="{'subject-item':true,'active':chooseSubject==item.subjectType}" @click="changeSubject(item)" v-for="(item,index) in subjectList" :key="index">
                <svg-icon class="fs34" :icon-class="'icon-judge-'+item.subjectType"></svg-icon>
                <span class='name'>{{item.subjectTypeName}}</span>
            </div>
        </div>
    </div>
    <NoResult class='all-center' v-else></NoResult>
</div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import {
    getGradeSubjectTypeRelationList
} from "@/api/resource"
import NoResult from "@/components/NoResult"
import {
    setTimeout
} from 'timers';
export default {
    name: '',
    components: {
        NoResult
    },
    data() {
        return {
            subjectList: [],
            chooseSubject: '',
            timer: null
        };
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    watch: {},
    beforeRouteEnter(to, from, next) {
        console.log(to, from)

        next(vm => {
            if (from.query && from.query.subjectType) {
                vm.chooseSubject = from.query.subjectType
            }
        })
    },
    methods: {
        //年级学科信息以及配置信息
        getGradeSubjectTypeRelationList() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "classGrade": this.getUserProfileInfo.grade
            }
            getGradeSubjectTypeRelationList(params).then(res => {
                if (res.flag) {
                    this.subjectList = res.data || [];
                    // console.log(this.subjectList)
                    // this.subjectList.length = 8;
                }
            })
        },
        changeSubject(item) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                return false
            }
            this.timer = setTimeout(() => {
                this.timer = null;
                this.chooseSubject = item.subjectType;
                this.$router.push({
                    path: '/judgeLearningTextbook',
                    query: {
                        subjectType: this.chooseSubject
                    }
                })
            }, 200)
        },
        //跳回首页
        goToHome() {
            this.$dialog.confirm({
                title: '',
                message: `确定退出诊断学情吗？`,
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
    created() {

    },
    mounted() {
        this.getGradeSubjectTypeRelationList();
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {
        console.log('activated')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.subject-content {
    padding: 0 15px;

    .choose {
        margin: 25px 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
    }

    .box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .subject-item {
            width: 105px;
            height: 90px;
            border: 1px solid #DDDDDD;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .name {
                color: #333;
                font-size: 16px;
                font-weight: 500;
                line-height: 23px;
            }
        }

        .active {
            border: 1px solid #4F77EC;
            background: #EFF3FF;
        }
    }

    .box::after {
        content: '';
        width: 30%;
    }
}
</style>

<template>
<div class=''>
    <van-nav-bar fixed placeholder title="诊断学情" left-text="">
        <template #left>
            <svg-icon class='mgr10 fs15' icon-class="icon-arrow-left" @click='onClickLeft' />
            <svg-icon class="fs17" icon-class="icon-cross" @click="goToHome" />
        </template>

    </van-nav-bar>
    <div class="subject-content" v-if="textBookList && textBookList.length>0">
        <div class='choose'>请选择版本</div>
        <div class='box'>
            <div :class="{'subject-item':true,'active':chooseTextBookId==item.textBookId}" @click="changeTextBook(item)" v-for="(item,index) in textBookList" :key="index">
                <span class='name'>{{item.textBookName}}</span>
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
    getTextBookVersionByGradeTerm
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
            textBookList: [],
            chooseTextBookId: '',
            query: {},
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
            if (from.query && from.query.textBookId) {
                vm.chooseTextBookId = from.query.textBookId
            }
        })
    },
    methods: {
        //获取版本信息
        getTextBookVersionByGradeTerm() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "gradeTermId": '',
                "subjectType": this.query.subjectType,
                "bookTypeIn": "",
                "classGrade": this.getUserProfileInfo.grade
            }
            getTextBookVersionByGradeTerm(params).then(res => {
                if (res.flag) {
                    this.textBookList = res.data || [];
                    // console.log(this.textBookList)
                    // this.textBookList.length = 8;
                }
            })
        },
        changeTextBook(item) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                return false
            }
            this.timer = setTimeout(() => {
                this.chooseTextBookId = item.textBookId;
                this.$router.push({
                    path: '/judgeLearningSection',
                    query: {
                        subjectType: this.query.subjectType,
                        textBookId: this.chooseTextBookId,
                        textBookName: item.textBookName
                    }
                })
                this.timer = null;
            },200)
        },
        
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
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
        this.query = this.$route.query || {}
        this.getTextBookVersionByGradeTerm();

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
                // color: #333;
                font-size: 16px;
                font-weight: 500;
                line-height: 23px;
            }
        }

        .active {
            border: 1px solid #4F77EC;
            background: #EFF3FF;
            color: #4F77EC;
        }
    }

    .box::after {
        content: '';
        width: 30%;
    }
}
</style>

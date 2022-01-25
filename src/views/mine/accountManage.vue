<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar fixed placeholder title="账号管理" left-text="" left-arrow @click-left="onClickLeft" />
    <div class="record-box">
        <van-cell value="" is-link @click="goToChangePassword">
            <template #title>
                <svg-icon class='mgr10' icon-class="icon-change-password" />
                <span class="custom-title">修改密码</span>
            </template>
        </van-cell>
    </div>
    <div class='button-box'>
        <div class='mgb30 button-item'>
            <van-button plain round block @click="quitLogin" type="info">退出当前账号</van-button>
        </div>
        <div class='mgb40 button-item'>
            <van-button plain round block @click="logOut" type="info">注销当前账号（永久删除）</van-button>
        </div>
    </div>

</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {};
    },

    components: {},

    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
        })
    },

    mounted() {
        console.log('getUserInfo', this.getUserInfo)
    },

    methods: {
        toLogin() {
            this.$router.push({
                path: '/login'
            })
        },
        //退出登录
        quitLogin() {
            this.$dialog.confirm({
                title: '',
                message: '确定退出当前账号？',
                // width: 300,
                theme: 'round-button',
            })
            .then(async() => {
                this.$toast('退出成功')
                await this.$store.commit('setUserInfo', null)
                //是否已登录
                await this.$store.commit('setHasLogin', false)
                await this.$store.commit('setUserProfileInfo', null)
                localStorage.clear()
                this.$router.replace(`/home`);
            })
            .catch(() => {
                // on cancel
            });
        },
        //注销
        logOut(){
            this.$dialog.confirm({
                title: '',
                message: '请提交“意见反馈”进行注销',
                width: 300,
                confirmButtonText:'去提交',
                theme: 'round-button',
            })
            .then(async() => {
                this.$router.push(`/opinion`);
            })
            .catch(() => {
                // on cancel
            });
        },
        //修改密码
        goToChangePassword() {
            this.$router.push(`/changePassword`);
        },
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        }
    },
};
</script>

<style lang="less" scoped>
.record-box {
    margin: 15px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(220,220,220,0.5);

    // padding: 10px 0;
    .custom-title {
        color: #333333;
    }
}

.button-box {
    position: absolute;
    bottom: 0;

    .button-item {
        width: 345px;
        padding: 0 15px;
    }
}
</style>
